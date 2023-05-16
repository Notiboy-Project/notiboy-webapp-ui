import { Box, Tab, TabList, Tabs } from '@chakra-ui/react';
import { MessageType } from '../../pages/Send/send.types';

interface NTabsProps {
  activeTab: string;
  tabs: { name: MessageType; title: string }[];
  onTabSelected: (tab: MessageType) => void;
}

export default function NTabs(props: NTabsProps) {
  const { tabs, onTabSelected } = props;

  const handleChangeTab = (index: number) => {
    const selectedTabName = tabs[index].name;
    onTabSelected(selectedTabName);
  };

  return (
    <Box
      backgroundColor={'gray.800'}
      width={'100%'}
      borderRadius={'full'}
      p={1}
    >
      <Tabs
        variant="soft-rounded"
        colorScheme="gray"
        onChange={handleChangeTab}
      >
        <TabList>
          {tabs.map((tab) => (
            <>
              <Tab
                _selected={{ backgroundColor: 'gray.600', color: '#fff' }}
                p={'10px 35px'}
              >
                {tab.title}
              </Tab>
            </>
          ))}
        </TabList>
      </Tabs>
    </Box>
  );
}
