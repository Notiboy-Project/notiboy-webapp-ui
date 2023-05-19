import { Box, Spinner, Text } from '@chakra-ui/react';

export default function SectionLoading() {
  return (
    <Box
      height={'100%'}
      width={'100%'}
      backgroundColor={'gray.200'}
      position={'absolute'}
      opacity={0.7}
      borderRadius={'2xl'}
      zIndex={2}
    >
      <Box
        display={'grid'}
        placeItems={'center'}
        alignContent={'center'}
        height={'100%'}
      >
        <Spinner color="blue.400" size={'lg'} />
        <Text mt={2} fontSize={'md'} color={'blue.400'}>
          Processing...
        </Text>
      </Box>
    </Box>
  );
}
