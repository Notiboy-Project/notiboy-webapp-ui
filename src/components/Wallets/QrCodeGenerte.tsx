import {
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent, 
  ModalOverlay,
  Text
} from '@chakra-ui/react';
import QRcode from 'qrcode';
import { useContext, useEffect, useState } from 'react';
import { getTokenFromStorage } from '../../services/storage.service';
import { UserContext } from '../../Context/userContext';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeGenerator(props: QRCodeGeneratorProps) {
  const { isOpen, onClose } = props;
  const [qrcode, setQRCode] = useState('');
  const { user } = useContext(UserContext);

  const text = {
    accessKey: getTokenFromStorage(),
    chain: user?.chain || 'algorand',
    address: user?.address || ''
  };

  const generateQR = async (text: string) => {
    try {
      const code = await QRcode.toDataURL(text);
      setQRCode(code);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generateQR(JSON.stringify(text));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius={'3xl'} p={5}>
        <ModalCloseButton />
        <ModalBody>
          <Flex
            justifyContent={'center'}
            flexDirection={'column'}
            alignItems={'center'}
          >
            <Text mb={4}>Scan QR to Login on mobile App</Text>
            <Image src={qrcode} height={300} mb={2} />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
