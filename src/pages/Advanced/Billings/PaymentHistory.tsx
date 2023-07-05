import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Text
} from '@chakra-ui/react';
import { PaymentHistoryDto } from '../../../services/services.types';
import moment from 'moment';

interface PaymentHistoryProps {
  data: PaymentHistoryDto[];
}

export default function PaymentHistory({ data }: PaymentHistoryProps) {
  return (
    <Flex flexDirection={'column'}>
      <Text my={5} fontSize={'xl'} fontWeight={600} textAlign={'center'}>
        Payment History
      </Text>
      <Box w={{ base: '100%', xl: '70%' }} margin={'0 auto'}>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Txn ID</Th>
                <Th isNumeric>Amount</Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.length === 0 && (
                <Tr>
                  <Td colSpan={3} textAlign={'center'}>
                    No records found
                  </Td>
                </Tr>
              )}
              {data.map((ph, index) => (
                <Tr key={ph.txn_id}>
                  <Td>{moment(ph.paid_time).format('LL')}</Td>
                  <Td
                    textOverflow={'ellipsis'}
                    whiteSpace={'nowrap'}
                    overflow={'hidden'}
                    maxW={'150px'}
                  >
                    {ph.txn_id}
                  </Td>
                  <Td isNumeric>${ph.paid_amount}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
