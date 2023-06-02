import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from '@chakra-ui/react';
import { deleteChannel } from '../../services/channels.service';
import React, { useCallback } from 'react';
import { UserContext } from '../../Context/userContext';

interface DeleteChannelModalProps {
  appId: string | null;
  updateChannelList: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function DeleteChannelModal({
  appId,
  updateChannelList,
  onClose,
  isOpen
}: DeleteChannelModalProps) {
  const [isDeleting, setDeleting] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const toast = useToast();

  const handleDeleteChannel = useCallback(async () => {
    // TODO: delete channel API call and update lists
    setDeleting(true);
    try {
      const resp = await deleteChannel(user?.chain || '', appId || '');
      const { status_code } = resp;
      if (status_code === 200) {
        toast({
          description: `Channel deleted !`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        setDeleting(false);
        updateChannelList();
        onClose();
      }
    } catch (err) {
      console.log('Error deleting channel', err);
      setDeleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={'2xl'}>
        <ModalHeader>Delete channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure to delete this channel?</Text>
        </ModalBody>
        <ModalFooter>
          <Button
            bgColor="secondary.900"
            mr={3}
            onClick={onClose}
            borderRadius={'3xl'}
          >
            Close
          </Button>
          <Button
            onClick={handleDeleteChannel}
            isLoading={isDeleting}
            bgColor={'red.400'}
            borderRadius={'3xl'}
          >
            Yes, Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
