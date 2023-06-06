import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';

interface AuthenticateSignedTransactionProps {
  onSignedTransaction: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthenticateSignedTransaction(
  props: AuthenticateSignedTransactionProps
) {
  const { isOpen, onClose, onSignedTransaction } = props;
  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign Transaction</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            Please sign a zero transaction to authenticate that you are the
            owner of this address. This transaction is never sent to the
            network.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
          <Button onClick={onSignedTransaction} colorScheme="blue">Authenticate</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
