import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";

interface SearchInputProps {
  onChange: (text: string) => void,
  value: string
}

export default function SearchInput(props: SearchInputProps) {
  return (
    <InputGroup borderRadius={'3xl'} w={'100%'} textAlign={'center'}>
      <InputLeftElement
        pointerEvents="none"
        color="blue.300"
        fontSize="1.6em"
        ml={2}
        top={'6px'}
        left={'6px'}
        children={
          <Icon h={6} w={6} ml={2}>
            <BiSearch />
          </Icon>
        }
        margin={'auto 0'}
      />
      <Input
        size={'lg'}
        padding={'28px 60px'}
        borderRadius={'3xl'}
        bgColor={'gray.800'}
        placeholder="Search anything here..."
      />
    </InputGroup>
  );
}
