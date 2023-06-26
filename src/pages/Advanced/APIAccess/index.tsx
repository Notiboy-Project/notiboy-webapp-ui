import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  Text,
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
import { useContext, useState } from 'react';
import { UserContext } from '../../../Context/userContext';
import { fetchAccessKeyPat } from '../../../services/users.service';
import moment from 'moment';
import RevokeAccessKeyModal from './RevokeAccessKeyModal';
import { BiTrash } from 'react-icons/bi';

export default function APIAccessPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useContext(UserContext);
  const [revokeKey, setRevokeKey] = useState('');

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
    <Box width={'100%'} p={[0, 1, 2, 5]}>
      <Flex justifyContent={'flex-start'} w={'100%'}>
        <Button
          onClick={onOpen}
          borderRadius={'3xl'}
          leftIcon={<Icon as={FaKey} />}
          px={8}
        >
          New key
        </Button>
      </Flex>
      <Box m="2rem auto">
        <TableContainer margin={'0 auto'} whiteSpace={'break-spaces'}>
          <Text p={2} fontWeight={600} mb={5}>
            Access Keys
          </Text>
          <Table variant="simple" align="center">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Issued date</Th>
                <Th>Permissions</Th>
                <Th />
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
                  <Td>
                    Full Access&nbsp;&nbsp;
                    <Button                      
                      borderRadius={'xl'}
                      bgColor={'red.400'}
                      color={'white'}
                      size='sm'
                      colorScheme="red"
                      onClick={() => setRevokeKey(ak.uuid)}
                    >
                      <Icon as={BiTrash} />
                    </Button>
                  </Td>
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
      <RevokeAccessKeyModal
        onRevokeSucceed={refreshAccessKeys}
        accessKeyID={revokeKey}
        isOpen={!!revokeKey}
        onClose={() => setRevokeKey('')}
      />
    </Box>
  );
}
