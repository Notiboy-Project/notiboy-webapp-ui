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
  InputLeftAddon
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
    try {
      // TODO: Signed transaction for transfering funds.
      setLoading(true);
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
      const encodedTransaction =
        algosdk.encodeUnsignedTransaction(addBalanceTxn);
      // END:
      const [signedTransactions] = await signTransactions([encodedTransaction]);
      const base64Str = convertJSTOBase64(signedTransactions);
      //
      const resp = await addBalance(
        user?.chain || '',
        user?.address || '',
        base64Str || ''
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
    } catch (err: any) {
      const { data } = err?.response || {};
      console.log('Error while adding funds: ', err);
      toast({
        description:
          data?.error || 'Service looks down ! please try agian later.',
        duration: 3000,
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setLoading(false);
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
            <InputRightAddon children="USDC" />
          </InputGroup>
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
