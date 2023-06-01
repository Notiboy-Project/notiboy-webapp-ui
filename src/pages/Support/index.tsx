import { Box } from '@chakra-ui/react';
import SearchInput from '../../components/SearchInput';
import SupportLists from './SupportList';
import { FAQS_DATA } from './support.types';
import { useState } from 'react';

export default function SupportPage(props: any) {
  const [data, setData] = useState(FAQS_DATA);
  const [text, setText] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setText(value);

    if (value?.trim()?.length > 2) {
      const _text = value.trim()?.toLowerCase();
      setData(
        FAQS_DATA.filter(
          (faq) =>
            faq.answer?.toLowerCase()?.includes(_text) ||
            faq.question?.toLowerCase()?.includes(_text)
        )
      );
    } else {
      setData(FAQS_DATA);
    }
  };

  return (
    <Box>
      <SearchInput value={text} onChange={handleSearch} placeholder='Search FAQs..' />
      <Box>
        <SupportLists data={data} />
      </Box>
    </Box>
  );
}
