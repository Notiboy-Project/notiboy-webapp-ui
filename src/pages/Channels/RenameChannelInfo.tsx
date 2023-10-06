import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text
} from '@chakra-ui/react';

interface RenameChannelInfoI {
  onContinue: () => void;
  onCancel: () => void;
  show: boolean;
}

export default function RenameChannelInfo(props: RenameChannelInfoI) {
  const { onContinue, onCancel, show } = props;
  return (
    <Modal isOpen={show} onClose={onCancel}>
      <ModalOverlay />
      <ModalContent borderRadius={'2xl'}>
        <ModalHeader>Renaming channel</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            After modifying the verified channel's name, you'll have to undergo
            the re-verification process.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            bgColor="secondary.900"
            mr={3}
            onClick={onCancel}
            borderRadius={'3xl'}
          >
            Cancel
          </Button>
          <Button
            onClick={onContinue}
            bgColor={'blue.400'}
            borderRadius={'3xl'}
          >
            Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
