import { Box, Flex, Text } from "@chakra-ui/react"
import { Link } from 'react-router-dom'

export default function NotFound404() {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent='center'
      alignItems={'center'}
      height={'100vh'}
    >
      <Flex gap={2} alignItems={'center'} mb={3}>
        <Text fontSize={'3xl'}>
          404
        </Text>
        <Text fontSize={'3xl'}>|</Text>
        <Text fontSize={'xl'}>Page not found</Text>
      </Flex>
      <Link to={'/'}>Go to main</Link>
    </Box>
  )
}