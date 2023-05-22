import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react';
// import DiscordOauth2 from 'discord-oauth2';
import { envs } from '../../config';

// const oAuth = new DiscordOauth2({
//   clientId: envs.discordClientId,
//   clientSecret: envs.discordPublicKey,
//   redirectUri: envs.discordRedirectUrl
// });

export default function Settings(props: any) {
  const handleDiscordVerification = () => {
    const windowFeatures = 'left=100,top=100,width=380,height=600';
    const handle = window.open(
      envs.discordAuthUrl,
      'mozillaWindow',
      windowFeatures
    );

    console.log({ handle });

    if (!handle) {
      console.log('Could not open pop-up windows..');
    }
  };

  return (
    <Box mt={4} p={5}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          p={'25px 25px'}
          borderRadius={'3xl'}
          backgroundColor={'gray.800'}
          placeholder="Enter your email id"
        />
        <InputRightElement width="5.5rem" top={1.5}>
          <Button
            borderRadius={'3xl'}
            bgColor={'blue.400'}
            h="1.75rem"
            size="sm"
            onClick={() => {}}
          >
            Verify
          </Button>
        </InputRightElement>
      </InputGroup>
      <Box mt={5} display={'flex'} alignItems={'center'}>
        <Text>Discord notificaiton:</Text>
        <Button
          onClick={handleDiscordVerification}
          borderRadius={'3xl'}
          ml={4}
          size={'sm'}
          bgColor={'blue.400'}
        >
          Verify discord
        </Button>
      </Box>
    </Box>
  );
}
