import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast
} from '@chakra-ui/react';
// import DiscordOauth2 from 'discord-oauth2';
import { envs } from '../../config';
import { useContext, useState } from 'react';
import { UserContext } from '../../Context/userContext';
import { verifyEmail } from '../../services/users.service';

// const oAuth = new DiscordOauth2({
//   clientId: envs.discordClientId,
//   clientSecret: envs.discordPublicKey,
//   redirectUri: envs.discordRedirectUrl
// });

export default function Settings(props: any) {
  const [email, setEmail] = useState('');
  const [isEmailSending, setEmailSending] = useState(false);

  const { user } = useContext(UserContext);
  const toast = useToast();

  const handleEmailVerification = async () => {
    // Check validations
    if (!email?.trim()) {
      toast({
        status: 'error',
        duration: 3000,
        description: 'Please enter a valid email address!',
        isClosable: true,
        position: 'top'
      });
      return;
    }

    // TODO: call API to verify email
    try {
      setEmailSending(true);
      const response = await verifyEmail(
        user?.chain || '',
        user?.address || '',
        email
      );
      if (response?.status_code === 200) {
        // TODO: show toast message about verification email has been sent
        toast({
          description: 'Email has been sent for verification !',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setEmail('');
        setEmailSending(false);
      }
    } catch (err) {
      console.log('Error while sending verification email', err);
      setEmailSending(false);
    }
  };

  const handleDiscordVerification = () => {
    const windowFeatures = 'left=100,top=100,width=380,height=600';

    const redirect_uri = envs.discordRedirectUrl || '';
    const urlParams = new URLSearchParams();
    urlParams.append('client_id', envs?.discordClientId || '');
    urlParams.append('redirect_uri', redirect_uri);
    urlParams.append('response_type', 'code');
    urlParams.append('scope', 'identify guilds.join');
    urlParams.append('state', `${user?.chain},${user?.address}`);

    const fullUrl = ` ${envs.discordAuthUrl}?${urlParams.toString()}`;

    const handle = window.open(fullUrl, 'mozillaWindow', windowFeatures);

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
          name="email"
          value={email}
          onChange={({ currentTarget }) => setEmail(currentTarget.value)}
        />
        <InputRightElement width="5.5rem" top={1.5}>
          <Button
            isLoading={isEmailSending}
            borderRadius={'3xl'}
            bgColor={'blue.400'}
            h="1.75rem"
            size="sm"
            disabled={email?.trim()?.length === 0 ? true : false}
            onClick={handleEmailVerification}
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
