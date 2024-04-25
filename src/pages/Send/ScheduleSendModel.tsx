import { useContext, useMemo, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react';
import BasicDateTimePicker from '../../components/DateTimePicker';
import { UserContext } from '../../Context/userContext';
import moment from 'moment';

interface ScheuduleSendPropsI {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

export default function ScheduleSendModel(props: ScheuduleSendPropsI) {
  const [date, setDate] = useState<Date | null>(null);
  const { isOpen, onClose } = props;
  const { user } = useContext(UserContext);

  const handleCloseModel = () => {
    setDate(null);
    onClose();
  };

  const maxDate = useMemo(() => {
    if (!user?.privileges?.notification_max_schedule) return undefined;

    const date = moment().add(
      user?.privileges?.notification_max_schedule,
      'days'
    );
    return date.toDate();
  }, [user?.privileges]);

  const onSetDate = () => {
    if (date) {
      props.onDateSelect(date);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModel}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Date & Time</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BasicDateTimePicker
            maxAllowedDate={maxDate}
            onChange={setDate}
            value={date}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            variant={'ghost'}
            mr={3}
            onClick={handleCloseModel}
            borderRadius={'2xl'}
          >
            Close
          </Button>
          <Button colorScheme="blue" onClick={onSetDate} borderRadius={'2xl'}>
            Set
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
