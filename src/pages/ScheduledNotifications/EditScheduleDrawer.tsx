import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton
} from '@chakra-ui/react';
import SendForm from '../Send';
import { ScheduledNotificationDto } from '../../services/services.types';

interface EditScheduledDrawerProps {
  onClose: () => void;
  isOpen: boolean;
  scheduled: ScheduledNotificationDto | null;
  onSuccessUpdated: () => void;
}

export default function EditScheduledDrawer(props: EditScheduledDrawerProps) {
  const { isOpen, onClose, scheduled, onSuccessUpdated } = props;
  return (
    <Drawer onClose={onClose} isOpen={isOpen} size={['full', 'xl']}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton onClick={onClose} />
        <DrawerHeader>Edit scheduled notification</DrawerHeader>
        <DrawerBody>
          {scheduled && (
            <SendForm
              onSuccessUpdated={onSuccessUpdated}
              isEdit={true}
              editPayload={scheduled}
            />
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
