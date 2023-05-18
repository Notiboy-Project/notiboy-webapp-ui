import { Box, Icon } from '@chakra-ui/react';
import { routes } from '../../config';
import { NavLink } from 'react-router-dom';
import {
  ShareIcon,
  SendIcon,
  StatisticsIcon,
  Notification1Icon,
  MessgeQuestionIcon
} from '../../assets/svgs';

const NAV_MENUS: { icon: any; name: string; url: string }[] = [
  {
    name: 'notifications',
    url: routes.notifications,
    icon: Notification1Icon
  },
  { name: 'channels', url: routes.channels, icon: ShareIcon },
  { name: 'send', url: routes.send, icon: SendIcon },
  { name: 'statistics', url: routes.statistics, icon: StatisticsIcon },
  { name: 'support', url: routes.support, icon: MessgeQuestionIcon }
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
          <NavLink to={menu.url} key={menu.name}>
            {({ isActive }) => (
              <Box>
                <Icon
                  as={menu.icon}
                  h={35}
                  w={35}
                  stroke={'blue.400'}
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
