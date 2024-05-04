import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  Button,
  useToast,
  Input,
  InputGroup,
  InputRightAddon,
  InputLeftAddon,
  Text
} from '@chakra-ui/react';
import algosdk from 'algosdk';
import { useContext, useState } from 'react';
import { UserContext } from '../../../Context/userContext';
import { addBalance } from '../../../services/users.service';
import {
  useWallet,
  DEFAULT_NODE_TOKEN,
  DEFAULT_NODE_PORT
} from '@txnlab/use-wallet';
import { envs } from '../../../config';
import { convertJSTOBase64 } from '../../../services/algorand.service';
import { NetworkType } from '../../ConnectWallet/wallet.types';
import xummService from '../../../services/xumm.service';

const { xumm } = xummService;
interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBalanceSucceeded?: () => void;
}

const algodClient = new algosdk.Algodv2(
  DEFAULT_NODE_TOKEN,
  envs.algorandNodeUrl || 'https://testnet-api.algonode.cloud',
  DEFAULT_NODE_PORT
);

export default function AddBalanceModal(props: AddBalanceModalProps) {
  const { isOpen, onClose, onAddBalanceSucceeded = () => {} } = props;
  const { signTransactions } = useWallet();
  const { user } = useContext(UserContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleClose = () => {
    onClose();
    setLoading(false);
    setAmount('');
  };

  const signAlgorandTransaction = async () => {
    const __amount = Number(amount) * 1000000;

    const suggestedParams = await algodClient.getTransactionParams().do();
    const addBalanceTxn =
      algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        amount: __amount,
        assetIndex: Number(envs.algorandAssetIndex) || 0,
        from: user?.address || '',
        suggestedParams: suggestedParams,
        to: envs.destinationAddress || ''
      });
    const encodedTransaction = algosdk.encodeUnsignedTransaction(addBalanceTxn);
    // END:
    const [signedTransactions] = await signTransactions([encodedTransaction]);
    const base64Str = convertJSTOBase64(signedTransactions);
    return base64Str;
  };

  const signXRPLTransaction = async () => {
    const __amount = (Number(amount) * 1000000).toString(); // XRP
    await xumm.payload?.createAndSubscribe(
      {
        TransactionType: 'Payment',
        Destination: envs.xrplDestinationAddress,
        Amount: __amount
      },
      (event: any) => {
        // Return if signed or not signed (rejected)
        console.log('event 27ln:', JSON.stringify(event, null, 2));
        if (event.data.signed === true) {
          // Call the login function to get token
          // console.log("event.data", event.data);
          const txnid = event?.data?.txid;
          sendAddBalanceRequest(txnid);
        }

        if (Object.keys(event.data).indexOf('signed') > -1) {
          // The `signed` property is present, true (signed) / false (rejected)
          if (event?.data?.signed === false) {
            toast({
              description: 'The transaction was rejected.',
              duration: 3000,
              isClosable: true,
              position: 'top',
              status: 'error'
            });
          }
          handleClose();
        }
      }
    );
  };

  const sendAddBalanceRequest = async (txn: string) => {
    const resp = await addBalance(
      user?.chain || '',
      user?.address || '',
      txn || ''
    );
    const { status_code, message } = resp;
    console.log('status_code: ' + status_code);
    console.log('message: ' + message);
    toast({
      description: 'Amount added to the account!',
      duration: 3000,
      isClosable: true,
      position: 'top',
      status: 'success'
    });
    onAddBalanceSucceeded();
    handleClose();
  };

  const handleAddBalance = async () => {
    if (!amount || Number(amount || 0) <= 0) {
      toast({
        description: 'Please enter valid amount.',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      return;
    }

    if (Number(amount || 0) < 2 && user?.chain === NetworkType.XRPL) {
      toast({
        description: 'Please add minimum 2 XRP.',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      return;
    }

    try {
      // TODO: Signed transaction for transfering funds.
      setLoading(true);
      let base64Transaction = '';

      toast({
        description: 'Please open your wallet to accept the request!',
        duration: 5000,
        isClosable: true,
        position: 'top',
        status: 'info'
      });

      if (user?.chain === NetworkType.XRPL) {
        signXRPLTransaction();
        return;
      }

      if (user?.chain === NetworkType.ALGORAND) {
        base64Transaction = await signAlgorandTransaction();
        sendAddBalanceRequest(base64Transaction);
      } else {
        toast({
          description: `${user?.chain} Network has not configured yet. Please contect the support!`,
          duration: 3000,
          isClosable: true,
          position: 'top',
          status: 'error'
        });
      }
    } catch (err: any) {
      const { data } = err?.response || {};
      const message = err
        ?.toString()
        ?.toLowerCase()
        ?.includes('Transaction Request Rejected'.toLowerCase())
        ? 'Transaction has request rejected by user.'
        : '';
      console.log('Error while adding funds: ', err);
      toast({
        description:
          data?.error ||
          message ||
          'Service looks down ! please try agian later.',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setLoading(false);
    }
  };

  const getCurrencyName = () => {
    switch (user?.chain) {
      case 'algorand':
        return 'USDC';
      case 'xrpl':
        return 'XRP';
      default:
        return 'USDC';
    }
  };

  return (
    <Modal
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={handleClose}
    >
      <ModalOverlay />
      <ModalContent borderRadius={'2xl'} p={3}>
        <ModalHeader>Add Fund</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <InputGroup size="md" borderRadius={'2xl'}>
            <InputLeftAddon children="$" />
            <Input
              value={amount}
              type="number"
              placeholder="Amount"
              onChange={({ currentTarget }) => setAmount(currentTarget?.value)}
            />
            <InputRightAddon children={getCurrencyName()} />
          </InputGroup>
          <Text as="small">
            <i>Min: 1 USD</i>{' '}
          </Text>

          <Flex justifyContent={'flex-end'} gap={3} mt={5}>
            <Button
              onClick={handleClose}
              borderRadius={'full'}
              variant={'ghost'}
            >
              Cancel
            </Button>
            <Button
              bg="blue.400"
              borderRadius={'full'}
              isLoading={loading}
              onClick={handleAddBalance}
            >
              Add fund
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
