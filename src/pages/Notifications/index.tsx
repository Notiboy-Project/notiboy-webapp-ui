import {
  Box,
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';
import { FaFilter } from 'react-icons/fa';

export default function NotificationPage(props: any) {
  return (
    <Box p={5}>
      <Box
        display={'flex'}
        placeItems={'center'}
        alignContent={'center'}
        height={'100%'}
      >
        <InputGroup borderRadius={'3xl'}>
          <InputLeftElement
            pointerEvents="none"
            color="blue.300"
            fontSize="1.6em"
            ml={2}
            top={'5px'}
            left={'5px'}
            children={
              <Icon h={5} w={5} ml={2}>
                <BiSearch />
              </Icon>
            }
            margin={'auto 0'}
          />
          <Input
            size={'lg'}
            padding={'25px 50px'}
            borderRadius={'3xl'}
            bgColor={'gray.800'}
            placeholder="Search anything here..."
          />
        </InputGroup>        
        <Button
          height={38}
          ml={4}
          width={38}
          colorScheme="blue"
          size="xl"
          p={5}
          borderRadius={'full'}
        >
          <Icon h={5} w={5} as={FaFilter} fill={'blue.400'} />
        </Button>
      </Box>
    </Box>
  );
}
