import { Box, Image, Text } from '@chakra-ui/react';
import { routes } from '../../config';
import { NavLink } from 'react-router-dom';
import CurveAbsoluteLayout from './CurveAbsoluteLayout';
import GooglePlayImg from '../../assets/images/Google-Play-Store-Button.png';
import AppleStoreImg from '../../assets/images/apple_store.png';
import ImageLogo from '../../assets/images/notiboy_nam.png';


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
      <Box mt={10} display={'grid'} placeItems={'center'} textAlign={'center'} fontSize={'xl'}>
        {NAV_MENUS.map((menu) => (
          <Box p={1} mb={4} w={'100%'} key={menu.name}>
            <NavLink to={menu.url}>
              {({ isActive, isPending }) => (
                <Box
                  p={6}
                  borderRadius={[25, 35]}
                  backgroundColor={isActive ? 'gray.700' : 'transparent'}
                  position={'relative'}
                >
                  {isActive && (
                    <Box position={'absolute'} top={-4} right={-8}>
                      <CurveAbsoluteLayout />
                    </Box>
                  )}
                  <Text fontWeight={600}>{menu.title}</Text>
                </Box>
              )}
            </NavLink>
          </Box>
        ))}
      </Box>
      <Box display={'grid'} placeItems={'center'} alignContent={'end'} gap={5}>
        <Image
          src={GooglePlayImg}
          h={45}
          w={40}
          objectFit={'contain'}
          borderRadius={10}
          display={'none'}
          cursor={'pointer'}
        />
        <Image
          src={AppleStoreImg}
          h={42}
          display={'none'}
          w={40}
          objectFit={'contain'}
          borderRadius={10}
          cursor={'pointer'}
        />
      </Box>
    </Box>
  );
}
