import * as React from 'react';
import {
  Box,
  Button,
  Icon,
  Image,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import algosdk, { Transaction } from 'algosdk';
import {
  useWallet,
  DEFAULT_NODE_TOKEN,
  DEFAULT_NODE_PORT,
  PROVIDER_ID
} from '@txnlab/use-wallet';
import { envs, routes } from '../../config';
import { AlgorandIcon } from '../../assets/svgs';
import { NetworkType } from './wallet.types';
import { convertJSTOBase64 } from '../../services/algorand.service';
import { loginToApp } from '../../services/api.service';
import { storeAddressToStorage, storeTokenToStorage } from '../../services/storage.service';
import { fetchUserInfo } from '../../services/users.service';
import { UserContext } from '../../Context/userContext';
import SectionLoading from '../../components/Layout/SectionLoading';
import AuthenticateSignedTransaction from './AuthenticateModal';

const algodClient = new algosdk.Algodv2(
  DEFAULT_NODE_TOKEN,
  envs.algorandNodeUrl || 'https://testnet-api.algonode.cloud',
  DEFAULT_NODE_PORT
);

export default function AlgorandWallets() {
  const { activeAccount, signTransactions, providers } = useWallet();
  const [isRequestProcessing, setRequestProcessing] = React.useState(false);
  const { saveUsersData } = React.useContext(UserContext);
  const [unSignedTransactions, setUnsignedTransactions] =
    React.useState<Transaction | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  const unSignedTransaction = async (address: string) => {
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
      setUnsignedTransactions(transaction);
      onOpen();
    } catch (err: any) {
      console.log('error', err);
    }
  };

  const handleCloseModal = () => {
    setUnsignedTransactions(null);
    onClose();
  };

  const getBg = (name: string) => {
    switch (name) {
      case 'MyAlgo':
        return '#3b56ea';
      case 'Pera':
        return '#3b56ea';
      case 'Defly':
        return '#faa500';
      case 'WalletConnect':
        return '#b741a7';
      case 'Daffi':
        return 'green.500';
      default:
        return '#3a57ea';
    }
  };

  const signTransactionAndLogin = async () => {
    const address = activeAccount?.address || '';
    //navigate(routes.notifications);
    try {
      if (!unSignedTransactions || !address) {
        toast({
          description: 'Failed to connect to Wallet ! please try again.',
          status: 'error',
          duration: 3000,
          position: 'top'
        });
        return;
      }
      onClose();

      setRequestProcessing(true);
      // console.log('transaction', transaction);

      const encodedTransaction =
        algosdk.encodeUnsignedTransaction(unSignedTransactions);
      // console.log('encodedTransaction ==>', encodedTransaction);
      const [signedTransactions] = await signTransactions([encodedTransaction]);
      // console.log('signedTransactions ==>', signedTransactions);
      const base64Str = convertJSTOBase64(signedTransactions);
      // console.log('base64 String ==>', base64Str);
      const response = await loginToApp(
        base64Str,
        NetworkType.ALGORAND,
        address
      );

      // console.log('response base64 login ==>', response);

      // storetoken into localstorag
      const { data } = response.data;
      if (data?.token) {
        storeAddressToStorage(address)
        storeTokenToStorage(data.token);
        // TODO: get logged in users information
        const resp = await fetchUserInfo(NetworkType.ALGORAND || '', address);
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
      handleCloseModal();
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
      // setSelectedNetwork(null);
    }
  };

  React.useEffect(() => {
    if (activeAccount && activeAccount.address) {
      unSignedTransaction(activeAccount.address);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAccount]);

  return (
    <>
      {isRequestProcessing && <SectionLoading />}
      <Box
        backgroundColor={'gray.700'}
        p={15}
        borderRadius={10}
        display={'grid'}
        width={'100%'}
        alignContent={'center'}
        placeItems={'center'}
      >
        <Box display={'grid'} placeItems={'center'}>
          <Icon mt={4} fill="blue.400" h={45} w={45}>
            <AlgorandIcon />
          </Icon>
          <Text mt={4} fontWeight={'bold'}>
            Connect a Wallet
          </Text>
          <Box display={'grid'} placeItems={'center'} gap={3} mt={2}>
            {providers?.map((provider) => (
              <React.Fragment key={provider.metadata.id}>
                <Button
                  key={provider.metadata.id}
                  size={'lg'}
                  color={'#fff'}
                  backgroundColor={getBg(provider.metadata.name)}
                  width={{ xs: '100%', sm: '100%', md: '50%', xl: '40%' }}
                  justifyContent={'space-between'}
                  rightIcon={
                    <Image src={provider.metadata.icon} height={35} width={35} />
                  }
                  colorScheme="linkedin"
                  onClick={provider.connect}
                  minW={275}
                >
                  {provider?.metadata?.name}
                </Button>
                {provider.metadata.id === PROVIDER_ID.MYALGO && (
                  <Text as="small" color={'red.400'}>
                    {provider.metadata.name}: Ledger/Multisig accounts only
                  </Text>
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
        <AuthenticateSignedTransaction
          isOpen={isOpen}
          onClose={handleCloseModal}
          onSignedTransaction={signTransactionAndLogin}
        />
      </Box>
    </>
  );
}
