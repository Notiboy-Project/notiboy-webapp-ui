import {
  Box,
  Flex,
  Text,
  Icon,
  Button,
  Tooltip,
  useToast
} from '@chakra-ui/react';
import { PaymentHistoryDto } from '../../../services/services.types';
import moment from 'moment';
import { CopyIcon } from '../../../assets/svgs';
import { CardLayout } from '../../../components/Layout/CardLayout';

interface PaymentHistoryProps {
  data: PaymentHistoryDto[];
}

export default function PaymentHistory({ data }: PaymentHistoryProps) {
  const toast = useToast();

  const handleCopy = (txnId: string) => {
    window?.navigator?.clipboard?.writeText(txnId);
    toast({
      description: 'TxnID Copied to clipboard.',
      duration: 3000,
      isClosable: true,
      position: 'top',
      status: 'success'
    });
  };

  return (
    <Flex flexDirection={'column'}>
      <Text my={5} fontSize={'xl'} fontWeight={600} textAlign={'center'}>
        Payment History
      </Text>
      <Box w={{ base: '100%', xl: '70%' }} margin={'0 auto'}>
        {data.length === 0 && (
          <CardLayout my={5}>
            <Text textAlign={'center'}>No history found</Text>
          </CardLayout>
        )}
        {data.map((ph) => (
          <CardLayout key={ph.txn_id} my={2}>
            <Flex
              justifyContent={'space-between'}
              alignItems={'center'}
              gap={2}
            >
              <Flex maxWidth={'90%'} flexDirection={'column'}>
                <Text>{moment(ph.paid_time).format('LL')}</Text>
                <Text
                  textOverflow={'ellipsis'}
                  whiteSpace={'nowrap'}
                  overflow={'hidden'}
                  fontSize={'xs'}
                  as="small"
                >
                  <Button
                    onClick={() => handleCopy(ph.txn_id)}
                    variant={'ghost'}
                    size="sm"
                    borderRadius={'full'}
                  >
                    <Tooltip hasArrow label="Copy Txn-id">
                      <Icon as={CopyIcon} />
                    </Tooltip>
                  </Button>
                  {ph.txn_id}
                </Text>
              </Flex>
              <Text fontWeight={600} color={'green.400'} fontSize={'xl'}>
                ${ph?.paid_amount.toFixed(2)}
              </Text>
            </Flex>
          </CardLayout>
        ))}
      </Box>
    </Flex>
  );
}
