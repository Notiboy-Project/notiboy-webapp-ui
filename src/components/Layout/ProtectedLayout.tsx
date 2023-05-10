import { Box } from '@chakra-ui/react';
import SidebarLayout from './SideBar';

export default function ProtectedLayout(props: any) {
  return (
    <Box p={10} display={'flex'}>
      <Box width={'20%'}>
        <SidebarLayout />
      </Box>
      <Box
        width={['90%', '90%', '90%', '90%']}
        id="main-content"
        backgroundColor={'gray.700'}
        height={'calc(100vh - 80px)'}
        overflow={'auto'}
        borderRadius={28}
        p={2}
      >
        {props.children}
      </Box>
    </Box>
  );
}
