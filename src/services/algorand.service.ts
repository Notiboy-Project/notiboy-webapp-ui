//We need pera, defly, daffi and wallet connect to be integrated

//install algosdk npm package
import algosdk, { Algodv2, Indexer } from "algosdk";
//Creating client and indexer instance
const client = new Algodv2("", "https://mainnet-api.algonode.cloud", "");
const indexer = new Indexer("", "https://mainnet-idx.algonode.cloud", "");

export const doTransactions = async (address: string) => {
  const params = await client.getTransactionParams().do();
  //Create transaction to be signed
  const auth = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      suggestedParams: params,
      to: address,
      amount: 0,
  });
  return auth
}
//create a transaction paramater


//Send it for signing to the wallet when sending you have to reconnect for pera, defly and daffi


//Convert unint8array to base64 string and send it to server. it will give you tokens
export const convertToString = (arg: BufferSource) => {
    return new TextDecoder("utf-8").decode(arg);
}
