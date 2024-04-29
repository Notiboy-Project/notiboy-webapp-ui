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
import { deleteScheduled } from '../../services/notification.service';
import React, { useCallback } from 'react';
import { UserContext } from '../../Context/userContext';
import { ScheduledNotificationDto } from '../../services/services.types';

interface DeleteScheduleProps {
  schedule: ScheduledNotificationDto | null;
  onDeleteSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function DeleteScheduleModal({
  schedule,
  onDeleteSuccess,
  onClose,
  isOpen
}: DeleteScheduleProps) {
  const [isDeleting, setDeleting] = React.useState(false);
  const { user } = React.useContext(UserContext);
  const toast = useToast();

  const handleDeleteChannel = useCallback(async () => {
    // TODO: delete channel API call and update lists
    setDeleting(true);
    try {
      const uuid = schedule?.UUID;
      const scheduleTime = schedule?.schedule;
      const resp = await deleteScheduled(
        user?.chain || '',
        uuid || '',
        scheduleTime || ''
      );
      const { status_code } = resp;
      if (status_code === 200) {
        toast({
          description: `Scheduled notification deleted !`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        setDeleting(false);
        onDeleteSuccess();
        onClose();
      }
    } catch (err) {
      console.log('Error deleting channel', err);
      setDeleting(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedule]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={'2xl'}>
        <ModalHeader>Delete Scheduled Notification</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure to delete this Scheduled notification?</Text>
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
