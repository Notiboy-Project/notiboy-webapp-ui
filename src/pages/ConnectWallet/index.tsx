import * as React from 'react';
import { Box, Hide, Image, Show, Text, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import ImageLogo from '../../assets/images/notiboy_nam.png';
import LogoNameImage from '../../assets/images/notiboy.png';
import algosdk from 'algosdk';
import {
  useWallet,
  DEFAULT_NODE_BASEURL,
  DEFAULT_NODE_TOKEN,
  DEFAULT_NODE_PORT
} from '@txnlab/use-wallet';
import { routes } from '../../config';
import NetworkLists from './NetworkList';
import { AlgorandIcon } from '../../assets/svgs';
import { NetworkType } from './wallet.types';
import NetworkWalletLists from '../../components/Wallets/NetworkWalletList';
import { convertJSTOBase64 } from '../../services/algorand.service';
import { loginToApp } from '../../services/api.service';
import { storeTokenToStorage } from '../../services/storage.service';
import { fetchUserInfo } from '../../services/users.service';
import { UserContext } from '../../Context/userContext';
import SectionLoading from '../../components/Layout/SectionLoading';

const algodClient = new algosdk.Algodv2(
  DEFAULT_NODE_TOKEN,
  DEFAULT_NODE_BASEURL,
  DEFAULT_NODE_PORT
);

export default function WalletConnect(props: any) {
  const { activeAccount, signTransactions } = useWallet();
  const [isRequestProcessing, setRequestProcessing] = React.useState(false);
  const { saveUsersData } = React.useContext(UserContext);
  const [selectedNetwork, setSelectedNetwork] =
    React.useState<NetworkType | null>(null);

  const navigate = useNavigate();
  const toast = useToast();

  const signedTransaction = async (address: string) => {
    //navigate(routes.notifications);
    try {
      const params = await algodClient.getTransactionParams().do();
      //Create transaction to be signed
      const transaction =
        await algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: address,
          to: address,
          amount: 0,
          suggestedParams: params
        });

      setRequestProcessing(true);
      console.log('transaction', transaction);

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction);
      // console.log('encodedTransaction ==>', encodedTransaction);
      const [signedTransactions] = await signTransactions([encodedTransaction]);
      // console.log('signedTransactions ==>', signedTransactions);
      const base64Str = convertJSTOBase64(signedTransactions);
      // console.log('base64 String ==>', base64Str);
      const response = await loginToApp(base64Str, 'algorand', address);
      // console.log('response base64 login ==>', response);

      // storetoken into localstorag
      const { data } = response.data;
      if (data?.token) {
        storeTokenToStorage(data.token);
        // TODO: get logged in users information
        const resp = await fetchUserInfo(selectedNetwork || '', address);
        console.log('userInfo response= =>', resp.data);
        saveUsersData(resp.data);
        navigate(routes.notifications);
      } else {
        toast({
          description: 'Failed to connect to Wallet ! please try again.',
          status: 'error',
          duration: 3000,
          position: 'top'
        });
      }
    } catch (err: any) {
      console.log('error', err);
      const errorString = err?.toString();
      if (errorString.includes('Rejected')) {
        toast({
          description: err?.toString(),
          status: 'error',
          duration: 3000,
          position: 'top'
        });
      } else {
        toast({
          description: 'Services looks down ! Please try again',
          status: 'error',
          duration: 3000,
          position: 'top'
        });
        // Needs to remove this navigation once the APIs is fully working
        navigate(routes.notifications);
      }
      setRequestProcessing(false);
      setSelectedNetwork(null);
    }
  };

  React.useEffect(() => {
    if (activeAccount && activeAccount.address && selectedNetwork) {
      signedTransaction(activeAccount.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  const handleSelectNetwork = (type: NetworkType) => {
    setSelectedNetwork(type);
  };

  return (
    <Box
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      height={'100vh'}
      width={'100vw'}
    >
      <Box
        backgroundColor={'blackAlpha.400'}
        p={10}
        display={'grid'}
        alignContent={'center'}
        placeItems={'center'}
        borderRadius={15}
        width={['95%', '75%', '65%']}
        position="relative"
      >
        {isRequestProcessing && <SectionLoading />}
        {/* <ColorModeSwitcher /> */}
        <Show above="md">
          <Image src={ImageLogo} alt="logo" height={75} width={250} />
        </Show>
        <Hide above="md">
          <Image src={LogoNameImage} alt="logo" height={75} width={85} />
        </Hide>
        <Text fontWeight={600} mt={2}>
          Effective Communication on Web3
        </Text>
        <Box
          mt={5}
          backgroundColor={'gray.700'}
          p={15}
          borderRadius={10}
          display={'grid'}
          width={'100%'}
          alignContent={'center'}
          placeItems={'center'}
        >
          {selectedNetwork ? (
            <NetworkWalletLists
              networkType={selectedNetwork}
              onBackClick={() => setSelectedNetwork(null)}
            />
          ) : (
            <NetworkLists
              networks={[
                {
                  name: NetworkType.ALGORAND,
                  title: 'Algorand',
                  Icon: <AlgorandIcon />
                }
              ]}
              onSelectNetwork={handleSelectNetwork}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
