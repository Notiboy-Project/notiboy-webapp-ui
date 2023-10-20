import { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react'
import BasicDateTimePicker from '../../components/DateTimePicker'

interface ScheuduleSendPropsI {
  isOpen: boolean
  onClose: () => void
  onDateSelecte: (date: Date) => void
}

export default function ScheduleSendModel(props: ScheuduleSendPropsI) {
  const [date, setDate] = useState<Date | null>(null)
  const { isOpen, onClose } = props

  console.log({ date });

  const onSetDate = () => {
    if (date) {
      props.onDateSelecte(date)
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Schedule Date</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <BasicDateTimePicker onChange={setDate} value={date} />
        </ModalBody>
        <ModalFooter>
          <Button variant={'ghost'} mr={3} onClick={onClose} borderRadius={'2xl'}>
            Close
          </Button>
          <Button colorScheme='blue' onClick={onSetDate} borderRadius={'2xl'}>Set</Button>
        </ModalFooter>
      </ModalContent>
    </Modal >
  )
}