import {
  Box, Button, Input,
  InputGroup, InputRightElement,
  Text
} from "@chakra-ui/react";


export default function Settings(props: any) {
  return (
    <Box mt={4} p={5}>
      <InputGroup size='md'>
        <Input
          pr='4.5rem'
          p={'25px 25px'}
          borderRadius={'3xl'}
          backgroundColor={'gray.800'}
          placeholder='Enter your email id'
        />
        <InputRightElement width='5.5rem' top={1.5}>
          <Button borderRadius={'3xl'} bgColor={'blue.400'} h='1.75rem' size='sm' onClick={() => { }}>
            Verify
          </Button>
        </InputRightElement>
      </InputGroup>
      <Box mt={5} display={'flex'} alignItems={'center'}>
        <Text>Discord notificaiton:</Text>
        <Button borderRadius={'3xl'} ml={4} size={'sm'} bgColor={'blue.400'}>Verify discord</Button>
      </Box>
    </Box>
  )
}