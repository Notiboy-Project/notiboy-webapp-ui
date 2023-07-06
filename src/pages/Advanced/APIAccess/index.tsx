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
import CreateAccessKeyModal from '../CreateAccessKeyModal';
import { useContext, useState } from 'react';
import { UserContext } from '../../../Context/userContext';
import { fetchAccessKeyPat } from '../../../services/users.service';
import moment from 'moment';
import RevokeAccessKeyModal from './RevokeAccessKeyModal';
import { BiTrash } from 'react-icons/bi';
import { CardLayout } from '../../../components/Layout/CardLayout';
import { FaKey } from 'react-icons/fa';

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
      <Box display={'flex'} flexDirection={'column'} gap={3}>
        <Flex justifyContent={'space-between'} my={5} alignItems={'center'}>
          <Text fontWeight={600} fontSize={'xl'}>
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
        {isLoading && (
          <Flex justifyContent={'center'}>
            <Spinner />
          </Flex>
        )}
        {!isLoading && data?.data?.length === 0 && (
          <CardLayout my={5}>
            <Text textAlign="center">No access key found</Text>
          </CardLayout>
        )}
        {!isLoading &&
          data?.data?.map((ak) => (
            <CardLayout
              key={ak.uuid}
              justifyContent={'space-between'}
              display={'flex'}
              alignItems={'center'}
              gap={2}
            >
              <Box>
                <Text as="sub" fontSize={'xs'}>
                  Name
                </Text>
                <Text>{ak.name}</Text>
              </Box>
              <Box>
                <Text as="sub">Issued Date</Text>
                <Text>{moment(ak.created).format('LL')}</Text>
              </Box>
              <Box>
                <Text as="sub">Permissions</Text>
                <Flex gap={2} alignItems={'center'}>
                  <Text>Full Access</Text>
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
                </Flex>
              </Box>
            </CardLayout>
          ))}
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
