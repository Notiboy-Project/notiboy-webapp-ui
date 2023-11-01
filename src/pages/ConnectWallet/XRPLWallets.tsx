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

  const handleAuthorizeXumm = () => {
    xumm.authorize();

    xumm.on("success", () => {
      console.log("XRPL authorized successfully::");
      xumm.user.account.then((account) => {
        // console.log({ account });
        // Do Login process and redirect to notifications
        loginToAppByXummWallet(account || '')
      });
    });

    xumm.on("error", (err) => {
      console.log("Error while XRPL authorized");
      // TODO: show error message
      console.log(err);
    });
  };

  return (
    <Box width={"100%"} textAlign={"center"}>
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
    </Box>
  );
}
