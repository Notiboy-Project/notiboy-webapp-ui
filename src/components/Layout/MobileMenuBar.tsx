import { Box, Icon } from '@chakra-ui/react';
import { routes } from '../../config';
import { IconType } from 'react-icons';
import { MdLiveHelp } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { ImStatsBars } from 'react-icons/im';
import { RiSendPlaneFill } from 'react-icons/ri';
import { IoIosNotifications, IoMdSync } from 'react-icons/io';

const NAV_MENUS: { icon: IconType; name: string; url: string }[] = [
  { name: 'notifications', url: routes.notifications, icon: IoIosNotifications },
  { name: 'channels', url: routes.channels, icon: IoMdSync },
  { name: 'send', url: routes.send, icon: RiSendPlaneFill },
  { name: 'statistics', url: routes.statistics, icon: ImStatsBars },
  { name: 'support', url: routes.support, icon: MdLiveHelp }
];

export default function MobileMenuBar() {
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
          <NavLink to={menu.url}>
            {({ isActive }) => (
              <Box key={menu.name}>
                <Icon
                  as={menu.icon}
                  h={35}
                  w={35}
                  fill={isActive ? 'blue' : ''}
                />
              </Box>
            )}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
}
