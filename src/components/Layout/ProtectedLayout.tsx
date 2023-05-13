import { Box } from '@chakra-ui/react';
import SidebarLayout from './SideBar';
import PrivateHeader from '../PrivateHeader';

export default function ProtectedLayout(props: any) {
  return (
    <Box p={{ sm: 0, md: 10 }} display={'flex'}>
      <Box
        display={{ base: 'none', sm: 'none', lg: 'block' }}
        width={{ lg: '20%' }}
      >
        <SidebarLayout />
      </Box>
      <Box
        width={{ base: '100%', sm: '100%', md: '100%', xl: '80%' }}
        id="main-content"
        backgroundColor={'gray.700'}
        height={{ base: '100%', sm: '100%', md: 'calc(100vh - 80px)' }}
        overflow={'auto'}
        borderRadius={{ base: 0, md: 15, lg: 28 }}
        p={2}
      >
        <PrivateHeader />
        {props.children}
      </Box>
    </Box>
  );
}
