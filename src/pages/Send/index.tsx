import { useState, useContext, useEffect } from 'react';
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
import {
  sendNotification,
  updateScheduledNotification
} from '../../services/notification.service';
import {
  KindType,
  ScheduledNotificationDto
} from '../../services/services.types';
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import ScheduleSendModel from './ScheduleSendModel';
import moment from 'moment';
import { BsFillClockFill } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { capitalizeLetter } from '../../utils';

type PayloadParam = {
  message: string;
  link: string;
  schedule: Date | null;
  user: string[];
};

interface SendFormProps {
  isEdit?: boolean;
  editPayload?: ScheduledNotificationDto;
  onSuccessUpdated?: () => void;
}

export default function SendForm(props: SendFormProps) {
  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC);
  const [inputAddress, setInputAddress] = useState('');
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
    setInputAddress('');
    setTab(_tab);
  };

  const handleAddressChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setInputAddress(value);
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

  const handleScheduleDate = (date: Date) => {
    setPayload({
      ...payload,
      schedule: date
    });
  };

  const clearScheduleDate = () => {
    setPayload({
      ...payload,
      schedule: null
    });
  };

  const handleCSVData = (data: string[]) => {
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

    setIsProcessing(true);
    try {
      const response = await sendNotification({
        appId: appId,
        chain: user?.chain || '',
        kind,
        address: user?.address || '',
        payload: {
          link: payload?.link || '',
          message: payload?.message || '',
          receivers: payload?.user?.length > 0 ? payload.user : undefined,
          schedule: payload?.schedule
            ? moment(payload?.schedule).format()
            : undefined
        }
      });
      if (response?.status_code === 200) {
        const toastMessage =
          MessageType.PUBLIC === kind
            ? `${capitalizeLetter(kind)} notification has been sent out`
            : `Notification sent out to ${payload?.user?.length} addresses`;

        toast({
          description: toastMessage,
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
        setInputAddress('');
        resetCsvUpload();
      }
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
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateScheduledNotification = async () => {
    try {
      setIsProcessing(true);
      const isValid = checkValidation();
      if (!isValid) return;

      const scheduledPayload = {
        type: tab === MessageType.PUBLIC ? 'public' : 'private',
        message: payload.message,
        link: payload.link,
        receivers: payload.user?.length > 0 ? payload?.user : null
      };
      // TODO: call API to update scheduled
      const data = await updateScheduledNotification({
        chain: user?.chain || 'NA',
        payload: scheduledPayload,
        uuid: props.editPayload?.UUID || '',
        scheduledTime: props.editPayload?.schedule || ''
      });
      if (data?.status_code === 200) {
        toast({
          description: 'Scheduled notification has been updated.',
          isClosable: true,
          position: 'top',
          status: 'success',
          duration: 3000
        });
        props.onSuccessUpdated && props.onSuccessUpdated();
      }
    } catch (err) {
      toast({
        description: 'Failed to update the scheduled Notification',
        isClosable: true,
        duration: 4000,
        status: 'error',
        position: 'top'
      });
      console.log('ERROR handleUpdateScheduledNotification::', err);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // Set or fill form data for edit the scheduled notifications
    if (props.isEdit && props.editPayload) {
      const { link, message, receivers = [], schedule } = props.editPayload;
      setPayload({
        link: link,
        message: message,
        schedule: new Date(schedule),
        user: receivers
      });
      if (receivers?.length === 1) {
        setInputAddress(receivers[0]);
      }
      let type =
        props.editPayload.type === 'private'
          ? MessageType.PERSONAL
          : MessageType.PUBLIC;

      if (receivers?.length > 1) {
        type = MessageType.BULK_PERSONAL;
      }
      setAppId(props.editPayload?.channel);
      setTab(type);
    }
  }, [props.editPayload, props.isEdit]);

  return (
    <>
      <Box
        display={{ base: 'grid', sm: 'flex', md: 'flex' }}
        alignItems={'center'}
        gap={5}
        marginTop={5}
        placeItems={'center'}
      >
        <Box width={{ base: '100%', md: 'fit-content' }}>
          <NTabs
            isResponsive={true}
            activeTab={tab}
            tabs={[
              { name: MessageType.PUBLIC, title: 'Public Message', index: 0 },
              {
                name: MessageType.PERSONAL,
                title: 'Personal Message',
                index: 1
              },
              {
                name: MessageType.BULK_PERSONAL,
                title: 'Bulk Personal Message',
                index: 2
              }
            ]}
            onTabSelected={handleTabChange}
          />
        </Box>
        <Box width={{ base: '100%', md: 'fit-content' }}>
          {props.isEdit ? (
            <Text
              fontWeight={'bold'}
              borderRadius={'full'}
              paddingX={4}
              textAlign={'center'}
              bgColor={'gray.800'}
              paddingY={3}
            >
              {props.editPayload?.channelName}
            </Text>
          ) : (
            <SelectChannel onChannelSelect={setAppId} />
          )}
        </Box>
      </Box>
      <Box>
        {tab === MessageType.PERSONAL && (
          <Input
            placeholder="Input address"
            backgroundColor={'gray.800'}
            name="inputAddress"
            size={'lg'}
            borderRadius={'xl'}
            value={inputAddress}
            p={'25px'}
            fontWeight={500}
            mt={4}
            onChange={handleAddressChange}
          />
        )}
        {tab === MessageType.BULK_PERSONAL && showCSVUpload && (
          <>
            <CsvUploadInput onDataReceived={handleCSVData} />
            {props.isEdit && payload?.user?.length > 1 && (
              <Text as="small" textAlign={'right'} width={'full'}>
                Uploaded addresses ({payload?.user?.length})
              </Text>
            )}
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
        <Text textAlign={'right'} fontSize={'sm'} color={'gray.300'}>
          {`${payload?.message?.length}/${allowedCharsCount}`}
        </Text>
        <InputGroup size="md">
          <Input
            placeholder="Enter a link"
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
      {payload?.schedule && (
        <Box marginTop={2} py={2} px={1} display={'flex'} alignItems={'center'}>
          <Icon as={BsFillClockFill} h={5} w={5} />
          <Text ml={2}>{moment(payload?.schedule).format('LLL')}</Text>
          {!props.isEdit && (
            <Button
              onClick={clearScheduleDate}
              size={'sm'}
              variant={'ghost'}
              marginLeft={2}
            >
              <Icon as={CgClose} />
            </Button>
          )}
        </Box>
      )}
      <Box mt={10} display={'flex'} justifyContent={'center'}>
        {props.isEdit ? (
          <Button
            onClick={handleUpdateScheduledNotification}
            p={'20px'}
            borderRadius={'full'}
            backgroundColor={'blue.600'}
            isLoading={isProcessing}
          >
            Update Scheduled Notification
          </Button>
        ) : (
          <ButtonGroup size="sm" isAttached>
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
              <MenuButton
                transition="all 0.2s"
                disabled={
                  (user?.privileges?.notification_max_schedule || 0) < 1
                }
                _disabled={{ cursor: 'not-allowed', opacity: 0.5 }}
              >
                <IconButton
                  borderRadius={'0 1rem 1rem 0'}
                  borderLeft={'1px'}
                  borderColor={'black'}
                  p={'20px 10px'}
                  aria-label="Send Schedule"
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
        )}
      </Box>
      <ScheduleSendModel
        isOpen={isOpen}
        onClose={onClose}
        onDateSelect={handleScheduleDate}
      />
    </>
  );
}
