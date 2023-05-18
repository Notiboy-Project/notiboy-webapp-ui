import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text
} from '@chakra-ui/react';
import { SupportDto } from './support.types';

interface SupportListsProps {
  data?: SupportDto[];
}

export default function SupportLists(props: SupportListsProps) {
  const { data = [] } = props;

  return (
    <Box mt={5}>
      {data.map((support) => (
        <Accordion      
          allowToggle
          backgroundColor={'gray.800'}
          borderRadius={'2xl'}
          key={support.id}
          mt={3}
          p={2}
        >
          <AccordionItem border={'none'}>
            <AccordionButton>
              <Box as="span" flex="1" textAlign="left">
                {support.question}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} textAlign={'left'}>
              <Text fontSize={16} color="gray.600" textAlign={'justify'}>
                {support.answer}
              </Text>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      ))}
    </Box>
  );
}
