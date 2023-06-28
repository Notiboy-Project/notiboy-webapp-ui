import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement,
  Icon,
  Box,
  Text
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { createAccesskey } from '../../services/users.service';
import { UserContext } from '../../Context/userContext';
import { BiCopy } from 'react-icons/bi';

interface CreateAccessKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshAccessKeys?: () => void;
}

export default function CreateAccessKeyModal(props: CreateAccessKeyModalProps) {
  const { isOpen, onClose, refreshAccessKeys = () => {} } = props;
  const { user } = useContext(UserContext);
  const [accessKey, setAccessKey] = useState<{
    name: string;
    token: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [keyname, setKeyname] = useState('');
  const toast = useToast();

  const handleClose = () => {
    onClose();
    setAccessKey(null);
    setKeyname('');
  };

  const handleCreateAPI = async () => {
    // TODO: Validation
    if (keyname?.trim()?.length === 0) {
      toast({
        description: 'Please enter a key name',
        status: 'error',
        isClosable: true,
        duration: 3000,
        position: 'top'
      });
      return;
    }
    try {
      setLoading(true);
      const { status_code, data } = await createAccesskey(
        user?.chain || '',
        user?.address || '',
        keyname
      );
      if (status_code === 201 || status_code === 200) {
        toast({
          description: 'Access key created successfully.',
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        setAccessKey({ token: data?.token, name: data?.token });
        setLoading(false);
        refreshAccessKeys();
      }
    } catch (e) {      
      setLoading(false);

    }
  };

  const handleKeyCopying = () => {
    navigator.clipboard.writeText(accessKey?.token || '').then(
      () => {
        toast({
          description: 'Access key copied',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      },
      (err) => {
        /* clipboard write failed */
        console.log('clipboard write failed', err);
      }
    );
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius={'3xl'}>
        <ModalHeader>Access Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {accessKey ? (
            <Box>
              <InputGroup size="md">
                <Input pr="4.5rem" value={accessKey?.token} readOnly={true} />
                <InputRightElement width="2.5rem">
                  <Button onClick={handleKeyCopying}>
                    <Icon as={BiCopy} />
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Text
                fontWeight={500}
                fontSize={'small'}
                mt={2}
                textAlign={'center'}
              >
                Note: The API key will be inaccessible once you leave this popup.
              </Text>
            </Box>
          ) : (
            <Input
              value={keyname}
              onChange={({ currentTarget }) => setKeyname(currentTarget.value)}
              type="text"
              placeholder="Access key name"
              borderRadius={'2xl'}
            />
          )}
        </ModalBody>
        <ModalFooter justifyContent={'center'}>
          {accessKey ? (
            <Button
              mr={3}
              onClick={handleClose}
              borderRadius={'2xl'}
              variant={'ghost'}
              background={'transparent'}
            >
              Close
            </Button>
          ) : (
            <Button
              background={'blue.500'}
              mr={3}
              isLoading={loading}
              onClick={handleCreateAPI}
              borderRadius={'2xl'}
            >
              Create
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
