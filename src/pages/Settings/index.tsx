import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  Text,
  useToast
} from '@chakra-ui/react';
// import DiscordOauth2 from 'discord-oauth2';
import { envs } from '../../config';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../Context/userContext';
import { updateMediums, verifyEmail } from '../../services/users.service';
import { capitalize } from '../../utils';
import { AiFillCheckCircle } from 'react-icons/ai';

export default function Settings(props: any) {
  const [email, setEmail] = useState('');
  const [isEmailSending, setEmailSending] = useState(false);
  const [isMediumUpdating, setMediumUpdating] = useState(false);

  const { user, refetchUserInfo } = useContext(UserContext);

  const {
    Email = { ID: '', Verified: false },
    Discord = { ID: '', Verified: false }
  } = user?.medium_metadata || {};
  const [mediums, setMediums] = useState({
    email: user?.allowed_mediums?.includes('email') || false,
    discord: user?.allowed_mediums?.includes('discord') || false
  });

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
    // const windowFeatures = 'left=100,top=100,width=380,height=600';

    const redirect_uri = envs.discordRedirectUrl || '';
    const urlParams = new URLSearchParams();
    urlParams.append('client_id', envs?.discordClientId || '');
    urlParams.append('redirect_uri', redirect_uri);
    urlParams.append('response_type', 'code');
    urlParams.append('scope', 'identify guilds.join');
    urlParams.append('state', `${user?.chain},${user?.address}`);

    const fullUrl = ` ${envs.discordAuthUrl}?${urlParams.toString()}`;

    // const handle = window.open(fullUrl, 'mozillaWindow', windowFeatures);

    window.location.href = fullUrl;
  };

  const handleUpdateMediums = async (obj: { [key: string]: boolean }) => {
    try {
      const medium = Object.keys(obj)[0];
      let msg = '';
      let payload = user?.allowed_mediums?.slice() || [];
      if (user?.allowed_mediums?.includes(medium)) {
        // remove from medium
        msg = `${capitalize(medium)} notification disabled`;
        payload.splice(payload.indexOf(medium), 1);
      } else {
        payload.push(medium);
        msg = `${capitalize(medium)} notification enabled`;
      }
      setMediumUpdating(true);
      const resp = await updateMediums(user?.chain || '', user?.address || '', {
        // Applying this hack as backend does not support to unset all mediums atm
        // we should refactor this logic asap from be side then fe side
        allowed_mediums: payload.length === 0 ? ['xyz'] : payload
      });
      if (resp.status_code === 200) {
        // Toast message
        toast({
          description: msg,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'success'
        });
        refetchUserInfo();
        setMediumUpdating(false);
      }
    } catch (err) {
      toast({
        description:
          'Notification medium updated failed! please try again later',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setMediumUpdating(false);
      console.log('Error updating users mediums', err);
    }
  };

  useEffect(() => {
    setMediums({
      email: user?.allowed_mediums?.includes('email') || false,
      discord: user?.allowed_mediums?.includes('discord') || false
    });
  }, [user?.allowed_mediums]);

  useEffect(() => {
    if (user?.medium_metadata?.Email) {
      setEmail(user?.medium_metadata?.Email?.ID || '');
    }
  }, [user?.medium_metadata]);

  useEffect(() => {
    refetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box mt={4}>
      <Text fontSize={'2xl'} fontWeight={600}>
        Notifications
      </Text>
      <Divider mt={4} mb={2} />
      <Flex
        p="0 5px"
        mt={4}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Text fontWeight={600}>Email:</Text>
        {Email.Verified && (
          <Switch
            ml={2}
            size={{ base: 'md', md: 'lg' }}
            disabled={isMediumUpdating}
            isChecked={mediums.email}
            name="email-switch"
            onChange={({ currentTarget }) =>
              handleUpdateMediums({
                email: currentTarget.checked
              })
            }
          />
        )}
      </Flex>
      <InputGroup mt={2} size="md">
        <Input
          pr="4.5rem"
          p={'25px'}
          borderRadius={'3xl'}
          backgroundColor={'gray.800'}
          placeholder="Enter your email id"
          name="email"
          value={email || ''}
          onChange={({ currentTarget }) => setEmail(currentTarget.value)}
        />
        <InputRightElement width={'fit-content'} right={3} top={1.5}>
          {Email.Verified && email === Email.ID ? (
            <Icon as={AiFillCheckCircle} fill="blue.400" h={25} w={25} mr={2} />
          ) : (
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
          )}
        </InputRightElement>
      </InputGroup>
      <Divider mt={5} mb={5} />
      <Box
        mt={5}
        p={'0 5px'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Flex alignItems={'center'}>
          <Text as="p" fontWeight={600}>
            Discord:
          </Text>
          <Button
            onClick={handleDiscordVerification}
            borderRadius={'3xl'}
            ml={4}
            size={'sm'}
            bgColor={'blue.400'}
          >
            Verify discord
          </Button>
          {Discord.Verified && (
            <>
              <Icon
                as={AiFillCheckCircle}
                fill="blue.400"
                h={22}
                w={22}
                ml={2}
              />
            </>
          )}
        </Flex>
        <Box>
          {Discord.Verified && (
            <Switch
              ml={2}
              isChecked={mediums.discord}
              size={{ base: 'md', md: 'lg' }}
              name="discord-switch"
              disabled={isMediumUpdating}
              onChange={({ currentTarget }) =>
                handleUpdateMediums({
                  discord: currentTarget.checked
                })
              }
            />
          )}
        </Box>
      </Box>
      {Discord?.ID && (
        <Text p={2} mt={2}>
          Verified Discord ID: {Discord.ID}
        </Text>
      )}
      <Divider mt={4} />
      <Text mt={4} fontWeight={500}>
        Note: Click the toggle button to enable or disable notifications
      </Text>
    </Box>
  );
}
