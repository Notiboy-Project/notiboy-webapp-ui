import { Box, Icon, Image, Text } from '@chakra-ui/react';
import { routes } from '../../config';
import { NavLink } from 'react-router-dom';
import CurveAbsoluteLayout from './CurveAbsoluteLayout';
import GooglePlayImg from '../../assets/images/Google-Play-Store-Button.png';
import AppleStoreImg from '../../assets/images/apple_store.png';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import {
  MessgeQuestionIcon,
  Notification1Icon,
  SendIcon,
  ShareIcon,
  ShuffleIcon,
  StatisticsIcon
} from '../../assets/svgs';

export const NAV_MENUS: {
  title: string;
  name: string;
  url: string;
  icon?: any;
}[] = [
  {
    title: 'Notifications',
    name: 'notifications',
    url: routes.notifications,
    icon: Notification1Icon
  },
  {
    title: 'Channels',
    name: 'channels',
    url: routes.channels,
    icon: ShareIcon
  },
  { title: 'Send', name: 'send', url: routes.send, icon: SendIcon },
  {
    title: 'Statistics',
    name: 'statistics',
    url: routes.statistics,
    icon: StatisticsIcon
  },
  {
    title: 'Advanced',
    name: 'advanced',
    url: routes.advanced,
    icon: ShuffleIcon
  },
  {
    title: 'Support',
    name: 'support',
    url: routes.support,
    icon: MessgeQuestionIcon
  }
];

export default function SidebarLayout(props: any) {
  return (
    <Box>
      <Image src={ImageLogo} alt="logo" height={55} margin={'15px auto'} />
      <Box
        mt={10}
        display={'grid'}
        placeItems={'center'}
        textAlign={'center'}
        fontSize={'xl'}
      >
        {NAV_MENUS.map((menu) => (
          <Box p={1} w={'100%'} key={menu.name}>
            <NavLink to={menu.url}>
              {({ isActive, isPending }) => (
                <Box
                  p={4}
                  borderRadius={[25, 35]}
                  backgroundColor={isActive ? 'gray.700' : 'transparent'}
                  position={'relative'}
                >
                  {isActive && (
                    <Box position={'absolute'} top={-4} right={-8}>
                      <CurveAbsoluteLayout />
                    </Box>
                  )}
                  <Text fontWeight={isActive ? 600 : 500}>{menu.title}</Text>
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

export function MobileMenuBar() {
  return (
    <Box
      position={'fixed'}
      bottom={0}
      height={55}
      backgroundColor={'gray.700'}
      width={'100%'}
      zIndex={2}
    >
      <Box
        display={'flex'}
        justifyContent={'space-around'}
        alignItems={'center'}
        height={'100%'}
      >
        {NAV_MENUS.map((menu) => (
          <NavLink to={menu.url} key={menu.name}>
            {({ isActive }) => (
              <Box>
                <Icon
                  as={menu.icon}
                  h={35}
                  w={35}
                  {...(isActive && menu.url === routes.advanced
                    ? { stroke: '#0B8BE6' }
                    : {})}
                  css={`
                    path {
                      stroke: ${isActive ? '#0B8BE6' : ''};
                    }
                  `}
                />
              </Box>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
}
