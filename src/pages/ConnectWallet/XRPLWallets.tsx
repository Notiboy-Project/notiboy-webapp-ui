import { Button } from "@chakra-ui/button";
import { Icon } from "@chakra-ui/icon";
import { Box, Text } from "@chakra-ui/layout";
import { XRPLIcon } from "../../assets/svgs";
import { Xumm } from 'xumm'
import { envs } from "../../config";

const xumm = new Xumm(envs.xummApiKey || '');
xumm.on("ready", () => console.log("XRPL networl Ready.."))

export default function XRPLWallets() {

  const handleAuthorizeXumm = () => {
    xumm.authorize()
  }

  return (
    <Box>
      <Box display={'grid'} placeItems={'center'}>
        <Icon mt={2} fill="blue.400" h={50} w={50} as={XRPLIcon} />
        <Text mt={2} fontWeight={500}>
          Connect a Wallet
        </Text>
      </Box>
      <Box mt={4}>
        <Button bgColor={'facebook.500'} width={'100%'} onClick={handleAuthorizeXumm}>
          Xumm
        </Button>
      </Box>
    </Box>
  )
}