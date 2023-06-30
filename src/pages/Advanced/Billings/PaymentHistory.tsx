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

export default function PaymentHistory() {
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
              <Tr>
                <Td>June 20, 2023</Td>
                <Td>Sflf2xx5f7x78sf44uiuis5</Td>
                <Td isNumeric>$25.4</Td>
              </Tr>       
              <Tr>
                <Td>June 24, 2023</Td>
                <Td>Sflf2xx5f7x78sf44uiuis5</Td>
                <Td isNumeric>$25.4</Td>
              </Tr>       
              <Tr>
                <Td>June 28, 2023</Td>
                <Td>Sflf2xx5f7x78sf44uiuis5</Td>
                <Td isNumeric>$25.4</Td>
              </Tr>             
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
