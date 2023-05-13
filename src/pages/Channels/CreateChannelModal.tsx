import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Textarea
} from '@chakra-ui/react';
import ImageUploadControl from '../../components/ImageUpload';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
  const { isOpen, onClose } = props;

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size={'xl'}
    >
      <ModalOverlay />
      <ModalContent borderRadius={'3xl'} p={2}>
        <ModalCloseButton
          background={'blue'}
          right={5}
          top={5}
          borderRadius={'full'}
          size={'md'}
        />
        <ModalBody p={5} mt={5}>
          <Box display="grid" placeItems={'center'}>
            <Text fontWeight="bold" mb="1rem" fontSize={'2xl'}>
              Create Channel
            </Text>
            <Box mt={2} w={'100%'}>
              <ImageUploadControl />
            </Box>
            <Input
              size="lg"
              placeholder="Enter channel name"
              mt={5}
              borderRadius={'2xl'}
              background={'gray.800'}
              fontWeight={500}
            />
            <Textarea
              placeholder="Enter channel description"
              rows={5}
              mt={5}
              p={4}
              borderRadius={'2xl'}
              background={'gray.800'}
              fontWeight={600}
            />
          </Box>
        </ModalBody>
        <ModalFooter margin={'0 auto'}>
          <Button
            backgroundColor="blue.600"
            mr={3}
            onClick={onClose}
            borderRadius={'3xl'}
            size={'lg'}
          >
            Create Channel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
