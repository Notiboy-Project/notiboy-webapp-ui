import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  useDisclosure
} from '@chakra-ui/react';
import useSWR from 'swr';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer
} from '@chakra-ui/react';
import { FaKey } from 'react-icons/fa';
import CreateAccessKeyModal from '../CreateAccessKeyModal';
import { useContext } from 'react';
import { UserContext } from '../../../Context/userContext';
import { fetchAccessKeyPat } from '../../../services/users.service';
import moment from 'moment';

export default function APIAccessPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);

  const {
    isLoading,
    data,
    mutate: refreshAccessKeys
  } = useSWR(
    { chain: user?.chain, address: user?.address },
    fetchAccessKeyPat,
    { revalidateOnFocus: false }
  );

  return (
    <Box width={'100%'}>
      <Flex justifyContent={'flex-end'} w={{ xl: '90%' }}>
        <Button
          onClick={onOpen}
          borderRadius={'3xl'}
          leftIcon={<Icon as={FaKey} />}
          px={8}
        >
          New key
        </Button>
      </Flex>
      <Box m="3rem auto">
        <TableContainer margin={'0 auto'}>
          <Table variant="simple" align='center'>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Issued date</Th>
                <Th>Permissions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading && (
                <Tr>
                  <Td colSpan={3} textAlign={'center'}>
                    <Spinner />
                  </Td>
                </Tr>
              )}
              {!isLoading && data?.data?.length === 0 && (
                <Tr>
                  <Td colSpan={3} textAlign="center">
                    No access key found
                  </Td>
                </Tr>
              )}
              {data?.data?.map((ak) => (
                <Tr key={ak.uuid}>
                  <Td>{ak.name}</Td>
                  <Td>{moment(ak.created).format('LL')}</Td>
                  <Td>Admin</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
      <CreateAccessKeyModal
        refreshAccessKeys={refreshAccessKeys}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  );
}
