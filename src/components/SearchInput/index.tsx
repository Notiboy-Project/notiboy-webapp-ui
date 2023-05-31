import { Icon, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { BiSearch } from 'react-icons/bi';

interface SearchInputProps {
  onChange: (event: React.FormEvent<HTMLInputElement>) => void;
  value: string;
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <InputGroup borderRadius={'3xl'} width={'100%'} textAlign={'center'}>
      <InputLeftElement
        pointerEvents="none"
        color="blue.300"
        fontSize="1.6em"
        ml={2}
        top={'4px'}
        left={'5px'}
        children={
          <Icon h={6} w={6} ml={2}>
            <BiSearch />
          </Icon>
        }
        margin={'auto 0'}
      />
      <Input
        size={'lg'}
        padding={'25px 60px'}
        onChange={props.onChange}
        value={props.value}
        borderRadius={'3xl'}
        bgColor={'gray.800'}
        placeholder="Search anything here..."
      />
    </InputGroup>
  );
}
