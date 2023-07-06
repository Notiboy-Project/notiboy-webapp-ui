import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast
} from '@chakra-ui/react';
import { revokeAccessKey } from '../../../services/users.service';
import { useContext, useState } from 'react';
import { UserContext } from '../../../Context/userContext';

interface RevokeAccessKeyModalProps {
  accessKeyID: string;
  onClose: () => void;
  isOpen: boolean;
  onRevokeSucceed?: () => void;
}

export default function RevokeAccessKeyModal(props: RevokeAccessKeyModalProps) {
  const { isOpen, onClose, onRevokeSucceed = () => {}, accessKeyID } = props;
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleRevokeAccess = async () => {
    // TODO: API call to revoke access token
    try {
      setLoading(true);
      const { status_code, message } = await revokeAccessKey(
        user?.chain || '',
        user?.address || '',
        accessKeyID
      );
      if (status_code === 200) {
        // TODO: Toast message on success
        toast({
          status: 'success',
          description: 'Access key has been revoked.',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        onRevokeSucceed();
        onClose();
      } else {
        toast({
          status: 'error',
          description: message || 'Services looks down ! please try again',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
      setLoading(false);
    } catch (e) {
      console.log('API Failed to revoke access key:', e);
      setLoading(false);
    }
  };

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius={'3xl'}>
        <ModalHeader>Revoke access Key</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure you want to remove this access token?
        </ModalBody>
        <ModalFooter justifyContent={'flex-end'}>
          <Button
            mr={3}
            onClick={onClose}
            borderRadius={'2xl'}
            variant={'ghost'}
            background={'transparent'}
          >
            Close
          </Button>
          <Button
            mr={3}
            isLoading={loading}
            bgColor={'red.400'}
            colorScheme="red"
            onClick={handleRevokeAccess}
            borderRadius={'2xl'}
            color={'#fff'}
          >
            Revoke
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
