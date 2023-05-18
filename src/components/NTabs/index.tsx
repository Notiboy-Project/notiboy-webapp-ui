import {
  Box,
  Button,
  Hide,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Tab,
  TabList,
  Tabs,
  Text
} from '@chakra-ui/react';
import { MessageType } from '../../pages/Send/send.types';
import { FaCaretDown } from 'react-icons/fa';

interface NTabsProps {
  activeTab: string;
  tabs: { name: MessageType; title: string }[];
  onTabSelected: (tab: MessageType) => void;
}

export default function NTabs(props: NTabsProps) {
  const { tabs, onTabSelected, activeTab } = props;

  const handleChangeTab = (index: number) => {
    const selectedTabName = tabs[index].name;
    onTabSelected(selectedTabName);
  };

  return (
    <Box
      backgroundColor={'gray.800'}
      width={'100%'}
      borderRadius={'full'}
      p={{ base: 0, md: 0, xl: 1 }}
    >
      <Show below="xl">
        <Menu>
          <MenuButton
            bgColor={'gray.800'}
            as={Button}
            rightIcon={<Icon as={FaCaretDown} fill="blue.400" />}
            borderRadius={'3xl'}
            size={'lg'}
            minW="245px"
            width={{ base: '100%', sm: '100%', md: '' }}
            p={5}
          >
            {activeTab}
          </MenuButton>
          <MenuList borderRadius={'3xl'} p={3}>
            {tabs.map((tab) => (
              <MenuItem
                key={tab.name}
                minH="48px"
                onClick={() => {
                  onTabSelected(tab.name);
                }}
                p={2}
                borderRadius={'2xl'}
              >
                <Text as="small">{tab.title}</Text>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Show>
      <Hide below="xl">
        <Tabs
          variant="soft-rounded"
          colorScheme="gray"
          onChange={handleChangeTab}
        >
          <TabList>
            {tabs.map((tab) => (
              <Tab
                key={tab.name}
                _selected={{ backgroundColor: 'gray.600', color: '#fff' }}
                p={'10px 35px'}
              >
                {tab.title}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Hide>
    </Box>
  );
}
