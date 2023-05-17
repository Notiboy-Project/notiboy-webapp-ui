import { Box, Icon } from '@chakra-ui/react';
import { routes } from '../../config';
import { BiAlarm, BiChart, BiSync } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { GiHelp } from 'react-icons/gi';
import { IoMdSend } from 'react-icons/io';
import { NavLink } from 'react-router-dom';

const NAV_MENUS: { icon: IconType; name: string; url: string }[] = [
  { name: 'notifications', url: routes.notifications, icon: BiAlarm },
  { name: 'channels', url: routes.channels, icon: BiSync },
  { name: 'send', url: routes.send, icon: IoMdSend },
  { name: 'statistics', url: routes.statistics, icon: BiChart },
  { name: 'support', url: routes.support, icon: GiHelp }
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
