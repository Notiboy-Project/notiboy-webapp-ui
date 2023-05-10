import { Box, Button, Image, Text } from '@chakra-ui/react';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import { routes } from '../../constants';
import { NavLink } from 'react-router-dom';

const NAV_MENUS: { title: string; name: string; url: string }[] = [
  { title: 'Notifications', name: 'notifications', url: routes.notifications },
  { title: 'Channels', name: 'channels', url: routes.channels },
  { title: 'Send', name: 'send', url: routes.send },
  { title: 'Statistics', name: 'statistics', url: routes.statistics },
  { title: 'Support', name: 'support', url: routes.support }
];

export default function SidebarLayout(props: any) {
  return (
    <Box>
      <Image src={ImageLogo} alt="logo" height={55} margin={'15px auto'} />
      <Box mt={10} display={'grid'} placeItems={'center'}>
        {NAV_MENUS.map((menu) => (
          <Box p={1} mb={4} w={'100%'}>
            <NavLink to={menu.url}>
              {({ isActive, isPending }) => (
                <Box
                  p={6}
                  borderRadius={[25, 35]}
                  backgroundColor={isActive ? 'gray.700' : 'transparent'}
                  position={'relative'}
                >
                  {isActive && (
                    <Box
                      position={'absolute'}
                      height={95}
                      width={75}
                      backgroundColor={'gray.700'}
                      right={-10}
                      top={-2}
                      borderRadius={[50, -50, 50, 50]}
                    />
                  )}
                  <Text fontWeight={600}>{menu.title}</Text>
                </Box>
              )}
            </NavLink>
          </Box>
        ))}
      </Box>
      <Box display={'grid'} placeItems={'center'} alignContent={'end'} gap={5}>
        <Button colorScheme="facebook">Google play</Button>
        <Button colorScheme="facebook">Apple store</Button>
      </Box>
    </Box>
  );
}
