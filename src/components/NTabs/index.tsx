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
import { FaCaretDown } from 'react-icons/fa';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface NTabsProps<T> {
  activeTab: T;
  tabs: { name: T; title: string }[];
  onTabSelected: (tab: T) => void;
  isResponsive?: boolean;
}

export default function NTabs<T>(props: NTabsProps<T>) {
  const { tabs, onTabSelected, activeTab, isResponsive = true } = props;
  const [activeTabTitle, setActiveTabTitle] = useState('');

  const handleChangeTab = useCallback(
    (index: number) => {
      const selectedTabName = tabs[index].name;
      const selectedTabTitle = tabs[index].title;
      onTabSelected(selectedTabName);
      setActiveTabTitle(selectedTabTitle);
    },
    [tabs, onTabSelected]
  );

  useEffect(() => {
    setActiveTabTitle(tabs.find((tab) => tab.name === activeTab)?.title || '');
  }, [activeTab, tabs]);

  const buttonTabs = useMemo(
    () => (
      <Tabs
        variant="soft-rounded"
        colorScheme="gray"
        onChange={handleChangeTab}
      >
        <TabList>
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              _selected={{ backgroundColor: 'gray.600', color: '#fff' }}
              p={'10px 35px'}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    ),
    [tabs, handleChangeTab]
  );

  return (
    <Box
      backgroundColor={'gray.800'}
      // width={'100%'}
      borderRadius={'full'}
      p={!isResponsive ? 1 : { base: 0, md: 0, xl: 1 }}
    >
      {!isResponsive ? (
        buttonTabs
      ) : (
        <>
          <Show below="xl">
            <Menu>
              <MenuButton
                bgColor={'gray.800'}
                as={Button}
                rightIcon={<Icon as={FaCaretDown} fill="blue.400" />}
                borderRadius={'3xl'}
                size={'lg'}
                width={'100%'}
                p={5}
              >
                {activeTabTitle}
              </MenuButton>
              <MenuList borderRadius={'3xl'} p={3}>
                {tabs.map((tab) => (
                  <MenuItem
                    key={tab.title}
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
          <Hide below="xl">{buttonTabs}</Hide>
        </>
      )}
    </Box>
  );
}
