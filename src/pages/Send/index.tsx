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
import { sendNotificaiton } from '../../services/notification.service';
import { KindType } from '../../services/services.types';

type PayloadParam = {
  message: string;
  link: string;
  user: string;
};

export default function SendPage() {
  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC);
  const [payload, setPayload] = useState<PayloadParam>({
    message: '',
    link: '',
    user: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [appId, setAppId] = useState('');

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

  const handleAddressChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setPayload({
      ...payload,
      user: value?.trim()
    });
  };

  const checkValidation = () => {
    let isValid = true;

    if (!appId) {
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

  const hadleCsvData = (data: string[]) => {
    console.log('CSV data ===>', data);
    if (
      data?.[0]?.toLowerCase()?.trim() !== 'address' ||
      String(data?.[1]).length === 0
    ) {
      toast({
        description: 'Invalid CSV uploaded',
        status: 'error',
        isClosable: true,
        position: 'top',
        duration: 3000
      });
      return;
    }
    const [, ...address] = data;
    setPayload({
      ...payload,
      user: address.join(',')
    });
  };

  const handleSendNotification = async () => {
    // TODO: check validation before sending notification
    const isDataValid = checkValidation();

    if (!isDataValid) {
      return;
    }

    let kind: KindType = 'public';

    if (tab === MessageType.PERSONAL || tab === MessageType.BULK_PERSONAL) {
      kind = 'private';
    }

    try {
      setIsProcessing(true);

      const response = await sendNotificaiton({
        appId: appId,
        chain: user?.chain || '',
        kind,
        address: user?.address || '',
        payload: {
          link: payload?.link || '',
          message: payload?.message || '',
          user: payload?.user
        }
      });
      console.log('Response message', response);
      if (response?.status_code === 200) {
        toast({
          description: 'Notification sent successfully!',
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
      } else {
        toast({
          description:
            response?.message || 'Something went wrong ! try again later',
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
      }
      setIsProcessing(false);
    } catch (err: any) {      
      toast({
        description:
          err?.response?.data?.message ||
          'Failed to send notifications! Please try again later',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setIsProcessing(false);
    }
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
          <SelectChannel onChannelSelect={setAppId} />
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
            onChange={handleAddressChange}
          />
        )}

        {tab === MessageType.BULK_PERSONAL && (
          <>
            <CsvUploadInput onDataRecieved={hadleCsvData} />
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
            placeholder="Upload a link"
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
