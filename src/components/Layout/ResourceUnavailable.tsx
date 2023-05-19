import { Alert, AlertIcon, AlertTitle, Box } from '@chakra-ui/react';

export default function ResourcesUnavailable() {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      height={'80%'}
      width={{ base: '100%', sm: '70%' }}
      margin={'0 auto'}
    >
      <Alert status="error" borderRadius={'2xl'}>
        <AlertIcon />
        <AlertTitle>
          Resources are not available at the moment! Try again later!
        </AlertTitle>
      </Alert>
    </Box>
  );
}
