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
  Textarea,
  useToast
} from '@chakra-ui/react';
import ImageUploadControl from '../../components/FileUpload/ImageUpload';
import { useState } from 'react'
import { createChannel } from '../../services/channels.service';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: () => void
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
  const { isOpen, onClose, mutate = () => { } } = props;
  const [submitting, setSubmitting] = useState(false)
  const [payload, setPayload] = useState<{
    name: string,
    description: string,
    logo: string | null
  }>({
    name: '',
    description: '',
    logo: null
  })
  const toast = useToast()

  const handleChange = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    setPayload({
      ...payload,
      [name]: value
    })
  }

  const handleImageChange = (imgBytes: string | null) => {
    setPayload({
      ...payload,
      logo: imgBytes
    })
  }

  const handleClose = () => {
    setPayload({
      name: '',
      description: '',
      logo: null
    })
    onClose()
    setSubmitting(false)
  }

  const handleCreateChannel = async () => {
    // TODO: call API to create a channel  
    try {
      setSubmitting(true)
      const resp = await createChannel('algorand', payload)
      const { status_code } = resp
      if (status_code === 201) {
        toast({
          description: 'Channel created !',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        })
        mutate()
        handleClose()
      }
    } catch (err) {
      console.log("Error creating channel", err)
      setSubmitting(false)
    }
  }

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={handleClose}
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
              <ImageUploadControl onImageChange={handleImageChange} />
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
