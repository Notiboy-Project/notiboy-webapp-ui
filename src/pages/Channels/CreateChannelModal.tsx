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
import React, { useState } from 'react';
import { createChannel, updateChannel } from '../../services/channels.service';
import { UserContext } from '../../Context/userContext';
import { ChannelsDto } from '../../services/services.types';
import RenameChannelInfo from './RenameChannelInfo';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  mutate: () => void;
  channel: ChannelsDto | null;
}

export default function CreateChannelModal(props: CreateChannelModalProps) {
  const { isOpen, onClose, mutate = () => { }, channel } = props;
  const [submitting, setSubmitting] = useState(false);
  const [payload, setPayload] = useState<{
    name: string;
    description: string;
    logo: string | null;
  }>({
    name: channel?.name || '',
    description: channel?.description || '',
    logo: channel?.logo || null
  });
  const [showRenameModel, setShowRenameModel] = useState(false);
  const toast = useToast();
  const { refetchUserInfo, user } = React.useContext(UserContext);

  const handleChange = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setPayload({
      ...payload,
      [name]: value
    });
  };

  const handleImageChange = (imgBytes: string | null) => {
    setPayload({
      ...payload,
      logo: imgBytes
    });
  };

  const handleClose = () => {
    setPayload({
      name: '',
      description: '',
      logo: null
    });
    onClose();
    setSubmitting(false);
  };

  const isPayloadValid = () => {
    let isValid = true;
    if (!payload?.name?.trim()) {
      isValid = false;
      toast({
        description: 'Channel name is required',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
    }

    if (!payload?.description) {
      isValid = false;
      toast({
        description: 'Description is required',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
    }
    return isValid;
  };

  const checkRenameStat = () => {
    if (channel?.verified && channel?.name !== payload?.name) {
      // TODO: Show rename model
      setShowRenameModel(true);
      return;
    }
    handleUpsertChannel();
  };

  const getPayloadChanges = () => {
    const newPayload: any = {};

    if (channel) {
      if (payload?.name !== channel?.name) {
        newPayload.name = payload?.name
      }
      if (payload?.logo !== channel?.logo) {
        newPayload.logo = payload?.logo
      }
      if (payload?.description !== channel?.description) {
        newPayload.description = payload?.description
      }
    }
    return newPayload
  }

  const handleUpsertChannel = async () => {
    setShowRenameModel(false);
    // TODO: Check validation before creating a new channel
    const isValid = isPayloadValid();
    if (!isValid) {
      return;
    }
    // TODO: call API to create a channel
    try {

      setSubmitting(true);

      const newPayload = getPayloadChanges();
      let resp: any;

      if (channel?.app_id) {
        // TODO: update channel
        if (Object.keys(newPayload).length === 0) {
          // No updates has made:          
          setSubmitting(false);
          return;
        }
        resp = await updateChannel(user?.chain || '', channel?.app_id, {
          ...newPayload
        });
      } else {
        resp = await createChannel(user?.chain || '', payload);
      }
      const { status_code } = resp;
      if (status_code === 201 || status_code === 200) {
        toast({
          description: 'Channel saved!',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        refetchUserInfo();
        mutate();
        handleClose();
      }
    } catch (err: any) {
      const { message = '' } = err?.response?.data || {};
      toast({
        description: message || 'Service looks down ! please try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      console.log('Error creating channel', err);
      setSubmitting(false);
    }
  };

  React.useEffect(() => {
    setPayload({
      name: channel?.name || '',
      description: channel?.description || '',
      logo: channel?.logo || null
    });
  }, [channel]);

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
              <ImageUploadControl
                image={channel?.logo || ''}
                onImageChange={handleImageChange}
              />
            </Box>
            <Input
              size="lg"
              placeholder="Enter channel name *"
              mt={5}
              onChange={handleChange}
              value={payload.name}
              name="name"
              borderRadius={'2xl'}
              background={'gray.800'}
              fontWeight={500}
            />
            <Textarea
              placeholder="Enter channel description *"
              rows={5}
              mt={5}
              p={4}
              name="description"
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
            onClick={checkRenameStat}
            borderRadius={'3xl'}
            size={'lg'}
            isDisabled={!!channel?.app_id && Object.keys(getPayloadChanges()).length === 0}
          >
            {channel?.app_id ? 'Update channel' : 'Create Channel'}
          </Button>
        </ModalFooter>
      </ModalContent>
      <RenameChannelInfo
        show={showRenameModel}
        onCancel={() => setShowRenameModel(false)}
        onContinue={handleUpsertChannel}
      />
    </Modal>
  );
}
