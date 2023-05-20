import { useState, useContext } from 'react';
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  useToast
} from '@chakra-ui/react';
import NTabs from '../../components/NTabs';
import { MessageType } from './send.types';
import { LinkIcon } from '../../assets/svgs';
import SelectChannel from '../../components/SelectChannel';
import CsvUploadInput from '../../components/FileUpload/CsvUploadInput';
import { UserContext } from '../../Context/userContext';

export default function SendPage() {
  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC);
  const [payload, setPayload] = useState({
    message: '',
    link: '',
    user: []
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentChannel, setCurrentChannel] = useState('');

  const toast = useToast();

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;

    setPayload({
      ...payload,
      [name]: value
    });
  };

  const { user } = useContext(UserContext);

  const showErrorMsg = (msg: string) => {
    toast({
      description: msg,
      duration: 3000,
      isClosable: true,
      position: 'top',
      status: 'error'
    });
  };

  const checkValidation = () => {
    let isValid = true;

    if (!currentChannel) {
      isValid = false;
      showErrorMsg('Please select a channel !');
    }

    if (!payload?.message?.trim()) {
      isValid = false;
      showErrorMsg('Please enter a message to send!');
    }

    if (tab === MessageType.PERSONAL && payload.user.length === 0) {
      isValid = false;
      showErrorMsg('Please enter an address to send notification!');
    }

    return isValid;
  };

  const handleSendNotification = () => {
    // TODO: check validation before sending notification
    const isDataValid = checkValidation();

    if (!isDataValid) {
      return;
    }

    setIsProcessing(true);
    // TODO: send notification by calling APIs
    console.log({ payload });
    console.log({ currentChannel });
    console.log({ user });
    setIsProcessing(false);
  };

  return (
    <Box p={5}>
      <Box
        display={{ base: 'grid', sm: 'flex', md: 'flex' }}
        alignItems={'center'}
        gap={5}
        placeItems={'center'}
      >
        <Box width={{ base: '100%', md: 'fit-content' }}>
          <NTabs
            activeTab={tab}
            tabs={[
              { name: MessageType.PUBLIC, title: 'Public Message' },
              { name: MessageType.PERSONAL, title: 'Personal Message' },
              {
                name: MessageType.BULK_PERSONAL,
                title: 'Bulk Personal Message'
              }
            ]}
            onTabSelected={setTab}
          />
        </Box>
        <Box width={{ base: '100%', md: 'fit-content' }}>
          <SelectChannel onChannelSelect={setCurrentChannel} />
        </Box>
      </Box>
      <Box mt={5}>
        {tab === MessageType.PERSONAL && (
          <Input
            placeholder="Input address"
            backgroundColor={'gray.800'}
            name="inputAddress"
            size={'lg'}
            borderRadius={'xl'}
            p={'25px'}
            fontWeight={500}
            mt={4}
          />
        )}

        {tab === MessageType.BULK_PERSONAL && (
          <>
            <CsvUploadInput onDataRecieved={console.log} />
          </>
        )}

        <Textarea
          borderRadius={'xl'}
          placeholder="Input a message *"
          name="message"
          mt={4}
          backgroundColor={'gray.800'}
          rows={4}
          onChange={handleChange}
          p={4}
          fontWeight={600}
        />
        <InputGroup size="md">
          <Input
            placeholder="Uploa a link"
            backgroundColor={'gray.800'}
            size={'lg'}
            borderRadius={'xl'}
            p={'25px'}
            name="link"
            onChange={handleChange}
            fontWeight={500}
            mt={4}
          />
          <InputRightElement width="4.5rem" top={5}>
            <Icon h={10} w={10} as={LinkIcon} />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box mt={10} display={'flex'} justifyContent={'center'}>
        <Button
          p={'20px 60px'}
          borderRadius={'full'}
          backgroundColor={'blue.600'}
          isLoading={isProcessing}
          onClick={handleSendNotification}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
