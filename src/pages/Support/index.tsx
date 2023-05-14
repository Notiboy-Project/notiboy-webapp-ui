import { Box } from '@chakra-ui/react';
import SearchInput from '../../components/SearchInput';
import SupportLists from './SupportList';
import { FAQS_DATA } from './support.types';


export default function SupportPage(props: any) {

  return (
    <Box p={5}>
      <SearchInput value='' onChange={() => { }} />
      <Box>
        <SupportLists data={FAQS_DATA} />
      </Box>
    </Box>
  );
}
