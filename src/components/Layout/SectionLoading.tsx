import { Box, Spinner, Text } from '@chakra-ui/react';

export default function SectionLoading() {
  return (
    <Box
      height={'100%'}
      width={'100%'}
      backgroundColor={'gray.200'}
      position={'absolute'}
      opacity={0.7}
      top={0}
      left={0}
      borderRadius={'2xl'}
      zIndex={2}
    >
      <Box
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100%'}
        gap={5}
      >
        <Spinner color="blue.400" size={'lg'} fontWeight={600} />
        <Text mt={2} fontSize={'lg'} color={'blue.500'} fontWeight={600}>
          Processing...
        </Text>
      </Box>
    </Box>
  );
}
