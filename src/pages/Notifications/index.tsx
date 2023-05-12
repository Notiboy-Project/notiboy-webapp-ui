import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Text
} from '@chakra-ui/react';
import useSWR from 'swr';
import { BiSearch } from 'react-icons/bi';
import { fetchNotifications } from '../../services/fetcher.service';
import { NoNotificationIcon } from '../../assets/svgs';

export default function NotificationPage(props: any) {
  const {
    error,
    isLoading,
    data = []
  } = useSWR(
    {
      url: `api/notifications`,
      params: { chain: 'algorand' }
    },
    fetchNotifications
  );

  console.log('error', error);
  console.log('isLoading', isLoading);
  console.log('data ==>', data);

  return (
    <Box p={5}>
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
        height={'100%'}
      >
        <InputGroup
          borderRadius={'3xl'}
          w={{ sm: '100%', md: '50%' }}
          textAlign={'center'}
        >
          <InputLeftElement
            pointerEvents="none"
            color="blue.300"
            fontSize="1.6em"
            ml={2}
            top={'6px'}
            left={'6px'}
            children={
              <Icon h={5} w={5} ml={2}>
                <BiSearch />
              </Icon>
            }
            margin={'auto 0'}
          />
          <Input
            size={'lg'}
            padding={'28px 60px'}
            borderRadius={'3xl'}
            bgColor={'gray.800'}
            placeholder="Search anything here..."
          />
        </InputGroup>
      </Box>
      <Box>
        {data?.length === 0 && (
          <Box display={'grid'} alignItems={'center'} justifyContent={'center'} mt={100}>
            <Icon h={300} w={300} as={NoNotificationIcon} />
            <Text mt={5} fontSize={28} fontWeight={600}>No Notification Yet!</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
