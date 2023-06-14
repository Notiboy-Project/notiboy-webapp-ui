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
  user: string[];
};

export default function SendPage() {
  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC);
  const [payload, setPayload] = useState<PayloadParam>({
    message: '',
    link: '',
    user: []
  });
  // its been used to reset csv upload after sending notification
  const [showCSVUpload, setShowCSVUpload] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appId, setAppId] = useState('');
  const { user } = useContext(UserContext);

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

  const showErrorMsg = (msg: string) => {
    toast({
      description: msg,
      duration: 3000,
      isClosable: true,
      position: 'top',
      status: 'error'
    });
  };

  const handleTabChange = (_tab: MessageType) => {
    setPayload({
      ...payload,
      user: []
    });
    setTab(_tab);
  };

  const handleAddressChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setPayload({
      ...payload,
      user: [value?.trim()]
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

    if (
      (tab === MessageType.PERSONAL || tab === MessageType.BULK_PERSONAL) &&
      payload.user.length === 0
    ) {
      isValid = false;
      showErrorMsg('Please enter an address to send notification!');
    }
    return isValid;
  };

  const hadleCsvData = (data: string[]) => {
    const [, ...address] = data;
    setPayload({
      ...payload,
      user: address
    });
  };

  const resetCsvUpload = () => {
    setShowCSVUpload(false);
    setTimeout(() => {
      setShowCSVUpload(true);
    }, 500);
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

    if (kind === MessageType.PUBLIC) {
      setIsProcessing(true);
      try {
        const response = await sendNotificaiton({
          appId: appId,
          chain: user?.chain || '',
          kind,
          address: user?.address || '',
          payload: {
            link: payload?.link || '',
            message: payload?.message || ''
          }
        });
        if (response?.status_code === 200) {
          toast({
            description: `Public notification has been sent out`,
            duration: 3000,
            isClosable: true,
            position: 'top',
            status: 'success'
          });
          setPayload({
            link: '',
            user: [],
            message: ''
          });
        }
        return;
      } catch (e: any) {
        toast({
          description:
            e?.response?.data?.message ||
            `Failed to send public notification ! please try again later`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'error'
        });
        console.log('Failed to send public notification', e);
        return;
      } finally {
        setIsProcessing(false);
      }
    }

    ///******** For private notification sending  ******/

    setIsProcessing(true);
    try {
      const response = await sendNotificaiton({
        appId: appId,
        chain: user?.chain || '',
        kind,
        address: user?.address || '',
        payload: {
          link: payload?.link || '',
          message: payload?.message || '',
          receivers: payload?.user
        }
      });
      console.log('Response message', response);
      if (response?.status_code === 200) {
        toast({
          description: `Notification sent out to ${payload?.user.length} addresses`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        setPayload({
          link: '',
          user: [],
          message: ''
        });
        resetCsvUpload();
      } else {
      }
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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box>
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
            onTabSelected={handleTabChange}
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
            {showCSVUpload && <CsvUploadInput onDataRecieved={hadleCsvData} />}
          </>
        )}

        <Textarea
          borderRadius={'xl'}
          placeholder="Input a message *"
          name="message"
          mt={4}
          value={payload?.message}
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
            value={payload?.link}
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
