import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Box, Text } from "@chakra-ui/layout";
import { XRPLIcon, XummIcon } from "../../assets/svgs";
import { routes, storageKey } from "../../config";
import { useContext, useState } from "react";
import { convertJSTOBase64 } from "../../services/algorand.service";
import { loginToApp } from "../../services/api.service";
import { NetworkType } from "./wallet.types";
import { storeAddressToStorage, storeTokenToStorage } from "../../services/storage.service";
import { fetchUserInfo } from "../../services/users.service";
import { UserContext } from "../../Context/userContext";
import { useNavigate } from "react-router";
import { useToast } from "@chakra-ui/toast";
import SectionLoading from "../../components/Layout/SectionLoading";
import xummService from "../../services/xumm.service";

const { xumm } = xummService;

export default function XRPLWallets() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { saveUsersData } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const getJWTTokenFromStorage = () => {
    const localData = localStorage.getItem(storageKey.XUMM_DATA_KEY)
    try {
      const data = JSON.parse(localData || '');
      return data?.jwt || null
    } catch (e) {
      console.log("Error while parsing xumm local storage data:: ", e);
      return null
    }
  }

  const loginToAppByXummWallet = async (walletAddress: string) => {
    console.log("Calling loginToAppByXummWallet::");
    try {
      setIsSigningIn(true)
      const jwtToken = getJWTTokenFromStorage()
      const base64Str = convertJSTOBase64(jwtToken);
      const response = await loginToApp(
        base64Str,
        NetworkType.XRPL,
        walletAddress || ""
      );
      // storetoken into localstorag
      const { data } = response.data;
      if (data?.token) {
        storeAddressToStorage(walletAddress || '')
        storeTokenToStorage(data.token);
        // TODO: get logged in users information
        const resp = await fetchUserInfo(NetworkType.XRPL || "", walletAddress || "");
        console.log("resp.data::", resp.data)
        saveUsersData(resp.data);
        navigate(routes.notifications);
      } else {
        toast({
          description: "Failed to connect to Wallet ! please try again.",
          status: "error",
          duration: 3000,
          position: "top",
        });
      }
    } catch (error) {
      console.log("Error while login into app:: XRPL", error);
    } finally {
      setIsSigningIn(false)
    }

  };

  // const signTransaction = async () => {
  //   onClose();
  //   setIsTransactionSigning(true);
  //   const payload = await xumm.payload?.createAndSubscribe(
  //     {
  //       TransactionType: "SignIn",
  //       Destination: account,
  //       Fee: String(12),
  //     },
  //     (event: any) => {
  //       // Return if signed or not signed (rejected)
  //       // setLastPayloadUpdate(JSON.stringify(event.data, null, 2))
  //       console.log("event 27ln:", JSON.stringify(event, null, 2));
  //       if (event.data.signed === true) {
  //         // Call the login function to get token
  //         loginToAppByXummWallet(event.data);
  //       }
  //       // Only return (websocket will live till non void)
  //       if (Object.keys(event.data).indexOf("signed") > -1) {
  //         return true;
  //       }
  //     }
  //   );
  //   setIsTransactionSigning(false);

  //   console.log("Payload", payload);

  //   if (payload) {
  //     // setPayloadUuid(payload.created.uuid)
  //     const transactionUrl =
  //       payload?.created?.next?.no_push_msg_received || "";
  //     // console.log("payload.created.uuid", payload.created.uuid);
  //     console.log({ transactionUrl });

  //     if (transactionUrl) {
  //       window.open(transactionUrl, "mozillaWindow", "popup")
  //       // setSignTransactionUrl(transactionUrl, "mozillaWindow", "popup")
  //     }

  //     if (xumm.runtime.xapp) {
  //       xumm.xapp?.openSignRequest(payload.created);
  //     } else {
  //       if (
  //         payload.created.pushed &&
  //         payload.created.next?.no_push_msg_received
  //       ) {
  //         // setOpenPayloadUrl(payload.created.next.no_push_msg_received)
  //         console.log(
  //           "payload.created.next.no_push_msg_received",
  //           payload.created.next.no_push_msg_received
  //         );
  //       } else {
  //         window.open(payload.created.next.always);
  //       }
  //     }
  //   }

  //   return payload;
  // };

  const handleAuthorizeXumm = () => {
    xumm.authorize();

    xumm.on("success", () => {
      console.log("XRPL authorized successfully::");
      xumm.user.account.then((account) => {
        console.log({ account });
        loginToAppByXummWallet(account || '')
        // Do Login process and redirect to notifications
      });
    });

    xumm.on("error", (err) => {
      console.log("Error while XRPL authorized");
      // TODO: show error message
      console.log(err);
    });
  };

  return (
    <Box width={"100%"} textAlign={"center"} position={'relative'}>
      {isSigningIn && <SectionLoading />}
      <Box display={"grid"} placeItems={"center"}>
        <Icon mt={2} fill="blue.400" h={50} w={50} as={XRPLIcon} />
        <Text mt={2} fontWeight={500}>
          Connect a Wallet
        </Text>
      </Box>
      <Box mt={4}>
        <Button
          size='lg'
          width={{ base: '100%', sm: '100%', md: '50%', xl: '60%' }}
          bgColor={"blue.500"}
          onClick={handleAuthorizeXumm}
        >
          <Icon as={XummIcon} h={45} w={75} />
        </Button>
      </Box>
      {/* <AuthenticateSignedTransaction
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSignedTransaction={() => { }}
      /> */}
    </Box>
  );
}
