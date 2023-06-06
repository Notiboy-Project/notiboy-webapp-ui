// import * as React from 'react';
import { Box, Hide, Show } from '@chakra-ui/react';
import SidebarLayout from './SideBar';
import PrivateHeader from '../PrivateHeader';
// import { UserContext } from '../../Context/userContext';
import MobileMenuBar from './MobileMenuBar';
import PushNotificationService from '../PushNotification';

export default function ProtectedLayout(props: any) {
  // const { user } = React.useContext(UserContext);

  // React.useEffect(() => {
  //   if (user) {
  //     // refetchUserInfo();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <Box p={{ sm: 0, md: 10 }} display={'flex'}>
      <Hide below="md">
        <Box width={{ lg: '20%' }}>
          <SidebarLayout />
        </Box>
      </Hide>
      <Show below="md">
        <MobileMenuBar />
      </Show>
      <Box
        width={{ base: '100%', sm: '100%', md: '100%', xl: '80%' }}
        marginBottom={{ base: '60px', xl: '0' }}
        id="main-content"
        backgroundColor={'gray.700'}
        height={{ base: 'calc(100vh - 60px)', md: 'calc(100vh - 80px)' }}
        overflow={'auto'}
        borderRadius={{ base: 0, md: 15, lg: 28 }}
        p={2}
      >
        <PrivateHeader />
        <Box p={{ base: 2, md: 5 }} mt={2}>{props.children}</Box>
      </Box>
      <PushNotificationService />
    </Box>
  );
}
