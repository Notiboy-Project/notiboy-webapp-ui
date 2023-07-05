import {
  Box,
  Button,
  Flex,
  Icon,
  Spinner,
  TableCaption,
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
      <Flex justifyContent={'flex-start'} w={'100%'}></Flex>
      <Box m="2rem auto">
        <TableContainer margin={'0 auto'} whiteSpace={'break-spaces'}>
          <Table variant="simple" align="center">
            <TableCaption textAlign={'left'} placement="top">
              <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Text py={2} fontSize={'2xl'} fontWeight={600}>
                  Access Keys
                </Text>
                <Button
                  onClick={onOpen}
                  borderRadius={'3xl'}
                  leftIcon={<Icon as={FaKey} />}
                  px={8}
                >
                  New key
                </Button>
              </Flex>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Issued date</Th>
                <Th isNumeric>Permissions</Th>
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
                  <Td isNumeric>
                    Full Access&nbsp;&nbsp;
                    <Button
                      borderRadius={'xl'}
                      bgColor={'red.400'}
                      color={'white'}
                      size="sm"
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
