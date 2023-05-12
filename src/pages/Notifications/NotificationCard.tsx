import { Box, Text } from "@chakra-ui/react";
import { NotificationData } from "./notification.types";

interface NotificationCardProps {
  notification: NotificationData
}

export default function NotificationCard(props:NotificationCardProps) {
  return(
    <Box>
      <Text>Notication Card</Text>
    </Box>
  )
}