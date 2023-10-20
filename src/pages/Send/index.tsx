import { useState, useContext } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import NTabs from '../../components/NTabs';
import { MessageType } from './send.types';
import { ArrowDownIcon, LinkIcon } from '../../assets/svgs';
import SelectChannel from '../../components/SelectChannel';
import CsvUploadInput from '../../components/FileUpload/CsvUploadInput';
import { UserContext } from '../../Context/userContext';
import { sendNotificaiton } from '../../services/notification.service';
import { KindType } from '../../services/services.types';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import ScheduleSendModel from './ScheduleSendModel';
import moment from 'moment';
import { BsFillClockFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';

type PayloadParam = {
  message: string;
  link: string;
  schedule: Date | null;
  user: string[];
};

export default function SendPage() {
  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC);
  const [payload, setPayload] = useState<PayloadParam>({
    message: '',
    link: '',
    schedule: null,
    user: []
  });
  // its been used to reset csv upload after sending notification
  const [showCSVUpload, setShowCSVUpload] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [appId, setAppId] = useState('');
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { user } = useContext(UserContext);

  const allowedCharsCount = user?.privileges?.notification_char_count || 120;

  const toast = useToast();

  const handleChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;

    if (value.length > allowedCharsCount) {
      return;
    }

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

  const handleScheudleDate = (date: Date) => {
    setPayload({
      ...payload,
      schedule: date
    })
  }

  const clearScheduleDate = () => {
    setPayload({
      ...payload,
      schedule: null
    })
  }

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
            schedule: null,
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
          message: '',
          schedule: null
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
            isResponsive={true}
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
            placeholder='Input address'
            backgroundColor={'gray.800'}
            name='inputAddress'
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
          placeholder='Input a message *'
          name='message'
          mt={4}
          value={payload?.message}
          backgroundColor={'gray.800'}
          rows={4}
          onChange={handleChange}
          p={4}
          fontWeight={600}
        />
        <Text textAlign={'right'} fontSize={'sm'} color={'gray.300'}>
          {`${payload?.message?.length}/${allowedCharsCount}`}
        </Text>
        <InputGroup size='md'>
          <Input
            placeholder='Enter a link'
            backgroundColor={'gray.800'}
            size={'lg'}
            borderRadius={'xl'}
            p={'25px'}
            name='link'
            value={payload?.link}
            onChange={handleChange}
            fontWeight={500}
            mt={4}
          />
          <InputRightElement width='4.5rem' top={5}>
            <Icon h={10} w={10} as={LinkIcon} />
          </InputRightElement>
        </InputGroup>
      </Box>
      {payload?.schedule && (
        <Box marginTop={2} py={2} px={1} display={'flex'} alignItems={'center'}>
          <Icon as={BsFillClockFill} h={5} w={5} />
          <Text ml={2}>{moment(payload?.schedule).format('LLL')}</Text>
          <Button onClick={clearScheduleDate} size={'sm'} variant={'ghost'} marginLeft={2}><Icon as={CgClose} /></Button>
        </Box>
      )}
      <Box mt={10} display={'flex'} justifyContent={'center'}>
        <ButtonGroup size='sm' isAttached>
          <Button
            p={'20px'}
            borderRadius={'full'}
            backgroundColor={'blue.600'}
            isLoading={isProcessing}
            onClick={handleSendNotification}
          >
            Send
          </Button>
          <Menu>
            <MenuButton transition='all 0.2s'>
              <IconButton
                borderRadius={'0 1rem 1rem 0'}
                borderLeft={'1px'}
                borderColor={'black'}
                p={'20px 10px'}
                aria-label='Send Scheudule'
                backgroundColor={'blue.600'}
                icon={
                  <Icon
                    as={ArrowDownIcon}
                    css={`
                      path {
                        fill: white;
                      }
                    `}
                  />
                }
              />
            </MenuButton>
            <MenuList borderRadius={'2xl'}>
              <MenuItem px={3} borderRadius={'xl'} onClick={onOpen}>
                Schedule Send
              </MenuItem>
            </MenuList>
          </Menu>
        </ButtonGroup>
      </Box>
      <ScheduleSendModel
        isOpen={isOpen}
        onClose={onClose}
        onDateSelecte={handleScheudleDate}
      />
    </Box>
  );
}
