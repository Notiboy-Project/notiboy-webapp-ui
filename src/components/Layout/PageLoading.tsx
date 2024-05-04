import { Box, Spinner } from '@chakra-ui/react';

export default function PageLoading() {
  return (
    <Box
      height={'65vh'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
    >
      <Spinner size={'md'} />
    </Box>
  );
}
