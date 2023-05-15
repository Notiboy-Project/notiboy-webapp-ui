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
import { useState } from 'react'
import { createChannel } from '../../services/fetcher.service';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
  const { isOpen, onClose } = props;
  const [submitting, setSubmitting] = useState(false)
  const [payload, setPayload] = useState<{
    name: string,
    description: string,
    logo: Uint8Array | null
  }>({
    name: '',
    description: '',
    logo: null
  })

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    setPayload({
      ...payload,
      [name]: value
    })
  }

  console.log('payload =>', payload)

  const setImageDate = (imgBytes: Uint8Array | null) => {
    setPayload({
      ...payload,
      logo: imgBytes
    })
  }

  const handleCreateChannel = async () => {
    // TODO: call API to create a channel  
    try {
      setSubmitting(true)
      const resp = createChannel('algorand', payload)
      console.log("resp ==>", resp)
      setSubmitting(false)
    } catch (err) {
      console.log("Error creating channel", err)
      setSubmitting(false)
    }
  }

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
          background={'blue.600'}
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
              <ImageUploadControl onImageChange={setImageDate} />
            </Box>
            <Input
              size="lg"
              placeholder="Enter channel name"
              mt={5}
              onChange={handleChange}
              value={payload.name}
              name='name'
              borderRadius={'2xl'}
              background={'gray.800'}
              fontWeight={500}
            />
            <Textarea
              placeholder="Enter channel description"
              rows={5}
              mt={5}
              p={4}
              name='description'
              onChange={handleChange}
              value={payload.description}
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
            isLoading={submitting}
            onClick={handleCreateChannel}
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
