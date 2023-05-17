import { useState, useContext } from 'react'
import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Textarea
} from '@chakra-ui/react';
import NTabs from '../../components/NTabs';
import { MessageType } from './send.types';
import { LinkIcon } from '../../assets/svgs';
import SelectChannel from '../../components/SelectChannel';
import CsvUploadInput from '../../components/FileUpload/CsvUploadInput';
import { UserContext } from '../../Context/userContext';

export default function SendPage() {

  const [tab, setTab] = useState<MessageType>(MessageType.PUBLIC)
  const { user } = useContext(UserContext)

  console.log({user})


  const handleSendNotification = () => {
    console.log('Send Notification');
    // TODO: send notification by calling APIs
  }

  return (
    <Box p={5}>
      <Box display={'flex'} alignItems={'center'}>
        <Box width={'fit-content'}>
          <NTabs
            activeTab={tab}
            tabs={[
              { name: MessageType.PUBLIC, title: 'Public Message' },
              { name: MessageType.PERSONAL, title: 'Personal Message' },
              { name: MessageType.BULK_PERSONAL, title: 'Bulk Personal Message' }
            ]}
            onTabSelected={setTab}
          />
        </Box>
        <Box ml={5}>
          <SelectChannel />
        </Box>
      </Box>
      <Box mt={5}>
        {tab === MessageType.PERSONAL && (
          <Input
            placeholder="Input address"
            backgroundColor={'gray.800'}
            name='inputAddress'
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
          placeholder="Input a message..."
          name="message"
          mt={4}
          backgroundColor={'gray.800'}
          rows={4}
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
            fontWeight={500}
            mt={4}
          />
          <InputRightElement width="4.5rem" top={5}>
            <Icon h={10} w={10} as={LinkIcon} />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box mt={5}>
        <Button
          p={'20px 60px'}
          borderRadius={'full'}
          backgroundColor={'blue.600'}
          onClick={handleSendNotification}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
