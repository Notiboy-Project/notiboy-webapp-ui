import { Icon } from '@chakra-ui/react';
import { NetworkType } from '../../pages/ConnectWallet/wallet.types';
import { AlgorandIcon, XRPLIcon } from '../../assets/svgs';

type ChainLogoT = {
  chain?: NetworkType;
};

export default function ChainLogo({ chain }: ChainLogoT) {
  return (
    <Icon height={35} width={35} fill="blue.400">
      {chain === NetworkType.ALGORAND && <AlgorandIcon />}
      {chain === NetworkType.XRPL && <XRPLIcon />}
    </Icon>
  );
}
