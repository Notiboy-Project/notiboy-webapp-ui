import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Text,
  Flex,
  Button,
  useToast
} from '@chakra-ui/react';
import { PlanKey } from '../../../plan-config';
import { useContext, useState } from 'react';
import { switchPlan } from '../../../services/users.service';
import { UserContext } from '../../../Context/userContext';

interface SwitchPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPlan: PlanKey;
  onPlanSwitchSuccess?: () => void;
}

export default function SwitchPlanModal(props: SwitchPlanModalProps) {
  const { isOpen, onClose, newPlan, onPlanSwitchSuccess = () => {} } = props;
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSwitchPlan = async (plan: string) => {
    setLoading(true);
    try {
      setLoading(true);
      const resp = await switchPlan(
        user?.chain || '',
        user?.address || '',
        plan
      );
      const { status_code, message } = resp?.data;
      if (status_code === 200) {
        //TOAST: success message
        toast({
          description: `You've switched plan to "${plan}".`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        onPlanSwitchSuccess();
        onClose();
      } else {
        toast({
          description: message || 'Service looks down! try again later.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
      }
    } catch (err: any) {
      setLoading(false);
      const { data = {} } = err?.response || {};
      toast({
        description: data?.error || 'Service looks down! try again later.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent borderRadius={'2xl'}>
        <ModalHeader>Switching plan</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Are you sure you want to switch the plan to{' '}
            <Text as="span" textTransform={'capitalize'} fontWeight={600}>
              `{newPlan}`
            </Text>
            ?
          </Text>
          <Flex my={5} justifyContent={'flex-end'} gap={5}>
            <Button onClick={onClose} borderRadius={'full'} variant={'ghost'}>
              cancel
            </Button>
            <Button
              onClick={() => handleSwitchPlan(newPlan)}
              isLoading={loading}
              variant={'solid'}
              borderRadius={'full'}
              colorScheme="blue"
            >
              Switch to
              <Text ml={1} textTransform={'capitalize'} as="span">
                {newPlan}
              </Text>
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
