import { Box, Button, Icon, Text } from "@chakra-ui/react";
import { BsPlus } from "react-icons/bs";


export default function ChannelsPage() {
  return (
    <Box>
      <Text>Channels page UI</Text>
      <Button
          h={38}
          ml={4}
          w={38}
          colorScheme="blue"
          size="xl"
          p={5}
          borderRadius={'full'}
        >
          <Icon h={8} w={8} as={BsPlus} fill={'#fff'} fontWeight={600} />
        </Button>
    </Box>
  )
}