import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Box, Link, Text } from "@chakra-ui/layout";
import { XRPLIcon, XummIcon } from "../../assets/svgs";
import { Xumm } from "xumm";
import { envs, routes } from "../../config";
import { useContext, useState } from "react";
import AuthenticateSignedTransaction from "./AuthenticateModal";
import { useDisclosure } from "@chakra-ui/hooks";
import { convertJSTOBase64 } from "../../services/algorand.service";
import { loginToApp } from "../../services/api.service";
import { NetworkType } from "./wallet.types";
import { storeTokenToStorage } from "../../services/storage.service";
import { fetchUserInfo } from "../../services/users.service";
import { UserContext } from "../../Context/userContext";
import { useNavigate } from "react-router";
import { useToast } from "@chakra-ui/toast";
import SectionLoading from "../../components/Layout/SectionLoading";

const xumm = new Xumm(envs.xummApiKey || "");

xumm.on("ready", () => console.log("XRPL networl Ready.."));

export default function XRPLWallets() {
  const [account, setAccount] = useState<string>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [isTransactionSigning, setIsTransactionSigning] = useState(false);
  const [signTransactionUrl, setSignTransactionUrl] = useState("");
  const { saveUsersData } = useContext(UserContext);
  const navigate = useNavigate();
  const toast = useToast();

  const handleCloseModal = () => {
    onClose();
    setSignTransactionUrl("");
    setIsTransactionSigning(false);
  };

  const loginToAppByXummWallet = async (transaction: any) => {
    console.log("Calling loginToAppByXummWallet::");
    try {
      const base64Str = convertJSTOBase64(transaction);
      console.log({ base64Str });
      const response = await loginToApp(
        base64Str,
        NetworkType.XRPL,
        account || ""
      );
      console.log({ response });
      // storetoken into localstorag
      const { data } = response.data;
      if (data?.token) {
        storeTokenToStorage(data.token);
        // TODO: get logged in users information
        const resp = await fetchUserInfo(NetworkType.XRPL || "", account || "");
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
    }
  };

  const signTransaction = async () => {
    onClose();
    setIsTransactionSigning(true);
    const payload = await xumm.payload?.createAndSubscribe(
      {
        TransactionType: "SignIn",
        Destination: account,
        Fee: String(12),
      },
      (event: any) => {
        // Return if signed or not signed (rejected)
        // setLastPayloadUpdate(JSON.stringify(event.data, null, 2))
        console.log("event 27ln:", JSON.stringify(event.data, null, 2));
        if (event.data.signed === true) {
          // Call the login function to get token
          loginToAppByXummWallet(event.data);
        }
        // Only return (websocket will live till non void)
        if (Object.keys(event.data).indexOf("signed") > -1) {
          return true;
        }
      }
    );
    setIsTransactionSigning(false);

    console.log("Payload", payload);

    if (payload) {
      // setPayloadUuid(payload.created.uuid)
      const transactionUrl =
        payload?.created?.next?.no_push_msg_received || "";
      // console.log("payload.created.uuid", payload.created.uuid);
      console.log({ transactionUrl });

      if (transactionUrl) {
        setSignTransactionUrl(transactionUrl)
      }

      if (xumm.runtime.xapp) {
        xumm.xapp?.openSignRequest(payload.created);
      } else {
        if (
          payload.created.pushed &&
          payload.created.next?.no_push_msg_received
        ) {
          // setOpenPayloadUrl(payload.created.next.no_push_msg_received)
          console.log(
            "payload.created.next.no_push_msg_received",
            payload.created.next.no_push_msg_received
          );
        } else {
          window.open(payload.created.next.always);
        }
      }
    }

    return payload;
  };

  const handleAuthorizeXumm = () => {
    xumm.authorize();

    xumm.on("success", () => {
      console.log("XRPL authorized successfully::");
      xumm.user.account.then((account) => {
        console.log({ account });
        setAccount(account);
        onOpen();
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
      {isTransactionSigning && <SectionLoading />}
      <Box display={"grid"} placeItems={"center"}>
        <Icon mt={2} fill="blue.400" h={50} w={50} as={XRPLIcon} />
        <Text mt={2} fontWeight={500}>
          Connect a Wallet
        </Text>
      </Box>
      <Box mt={4}>
        <Button
          bgColor={"blue.500"}
          width={"80%"}
          onClick={handleAuthorizeXumm}
        >
          <Icon as={XummIcon} h={45} w={75} />
        </Button>
      </Box>
      <Box p={2}>
        {signTransactionUrl && (
          <Text>
            Please follow this link to&nbsp;
            <Link color="teal.500" href={signTransactionUrl} target="_blank">
              Sign transaction.
            </Link>
          </Text>
        )}
      </Box>
      <AuthenticateSignedTransaction
        isOpen={isOpen}
        onClose={handleCloseModal}
        onSignedTransaction={signTransaction}
      />
    </Box>
  );
}
