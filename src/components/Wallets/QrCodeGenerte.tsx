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
import { UserContext } from '../../Context/userContext';
import api, { apiURL } from '../../services/api.service';
import PageLoading from '../Layout/PageLoading';

interface QRCodeGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRCodeGenerator(props: QRCodeGeneratorProps) {
  const { isOpen, onClose } = props;
  const [qrcode, setQRCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const generateQR = async (text: string) => {
    try {
      const code = await QRcode.toDataURL(text);
      setQRCode(code);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchTokenForMobile = async () => {
    try {
      setLoading(true);
      const resp = await api.post(
        apiURL.createPat(
          user?.chain || '',
          user?.address || '',
          `mt-${user?.address}`,
          'mobile'
        ),
        {
          description: 'Mobile app access token.'
        }
      );
      const { data } = resp?.data;
      const text = {
        accessKey: data?.token || '',
        chain: user?.chain || 'algorand',
        address: user?.address || ''
      };
      generateQR(JSON.stringify(text));
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokenForMobile();
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
            {loading ? (
              <PageLoading />
            ) : (
              <Image src={qrcode} height={300} mb={2} />
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
