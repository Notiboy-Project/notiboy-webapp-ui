import { Box, Spinner } from '@chakra-ui/react';

export default function SectionLoading() {
  return (
    <Box
      height={'100%'}
      width={'100%'}
      backgroundColor={'gray.300'}
      position={'absolute'}
      opacity={.2}
      zIndex={1}
    >
      <Box
        display={'grid'}
        placeItems={'center'}
        alignContent={'center'}
        height={'100%'}
      >
        <Spinner color='blue.400' size={'lg'} zIndex={1} />
      </Box>
    </Box>
  );
}
