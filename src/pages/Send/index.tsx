import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import ScheduledNotification from './ScheduledNotifications';
import SendForm from './SendForm';

export default function SendPage() {
  return (
    <Tabs variant="enclosed">
      <TabList>
        <Tab>New Notifications</Tab>
        <Tab>Scheduled Notifications</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <SendForm />
        </TabPanel>
        <TabPanel>
          <Box marginTop={5}>
            <ScheduledNotification />
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
