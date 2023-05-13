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

export default function SendPage() {
  return (
    <Box p={5}>
      <Box width={'fit-content'}>
        <NTabs
          activeTab={MessageType.PUBLIC}
          tabs={[
            { name: MessageType.PUBLIC, title: 'Public Message' },
            { name: MessageType.PERSONAL, title: 'Personal Message' },
            { name: MessageType.BULK_PUBLIC, title: 'Bulk Personal Message' }
          ]}
          onTabSelected={(tab) => console.log('sElected tab:', tab)}
        />
      </Box>
      <Box mt={5}>
        <Input
          placeholder="Input address"
          backgroundColor={'gray.800'}
          size={'lg'}
          borderRadius={'xl'}
          p={'25px'}
          fontWeight={500}
          mt={4}
        />
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
          p={'25px 60px'}
          borderRadius={'2xl'}
          backgroundColor={'blue.600'}
          size={'lg'}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
}
