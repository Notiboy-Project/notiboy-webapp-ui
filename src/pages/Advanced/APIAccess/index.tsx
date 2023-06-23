import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { FaKey } from 'react-icons/fa';

export default function APIAccessPage() {
  return (
    <Box>
      <Flex justifyItems={'flex-end'} w={{ xl: '90%' }}>
        <Button borderRadius={'3xl'} leftIcon={<Icon as={FaKey} />} px={8}>
          New key
        </Button>
      </Flex>
    </Box>
  );
}
