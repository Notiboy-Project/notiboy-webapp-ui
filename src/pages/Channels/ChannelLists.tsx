import { Avatar, Box, Button, Icon, Text } from '@chakra-ui/react';
import { CardLayout } from '../../components/Layout/CardLayout';
import { VerifyIcon } from '../../assets/svgs';

export default function ChannelLists(props: any) {
  return (
    <CardLayout p={5}>
      <Box display={'flex'} alignItems={'center'}>
        <Avatar name="avatar" src="avtar" height={'40px'} width={'40px'} />
        <Text ml={3}>Artificial Intelligent channel</Text>
        <Icon as={VerifyIcon} ml={3} />
      </Box>
      <Text as="p" fontSize={'md'} fontWeight={500} textAlign={'left'} mt={2}>
        It's a long establushment face that a reader will be distracted by the
        readable content of a page when looking at its layout
      </Text>
      <Box>
        <Button backgroundColor={'blue.500'} borderRadius={'3xl'} mt={4}>
          Join Channel
        </Button>
      </Box>
    </CardLayout>
  );
}
