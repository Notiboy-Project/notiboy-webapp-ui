import { Box, Flex } from '@chakra-ui/react';
import NTabs from '../../components/NTabs';
import { useState } from 'react';
import Billings from './Billings';
import APIAccessPage from './APIAccess';

enum PageType {
  API_ACCESS = 'API-ACCESS',
  BILLING = 'BILLING'
}

export default function AdvancePage() {
  const [activeTab, setActiveTab] = useState<PageType>(PageType.API_ACCESS);

  return (
    <Box>
      <Flex justifyContent={'center'}>
        <NTabs
          isResponsive={false}
          tabs={[
            { title: 'API Access', name: PageType.API_ACCESS },
            { title: 'Billings', name: PageType.BILLING }
          ]}
          activeTab={activeTab}
          onTabSelected={(tab) => setActiveTab(tab)}
        />
      </Flex>
      <Flex mt={5}>
      {activeTab === PageType.API_ACCESS ? <APIAccessPage /> : <Billings />}
      </Flex>      
    </Box>
  );
}
