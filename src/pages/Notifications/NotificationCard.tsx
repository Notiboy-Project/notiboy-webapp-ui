import React from "react";
import moment from "moment";
import { Avatar, Box, Icon, Text } from "@chakra-ui/react";
import { NotificationData } from "./notification.types";
import { LinkIcon, VerifyIcon } from "../../assets/svgs";
import { CardLayout } from "../../components/Layout/CardLayout";
import { ChannelsDto } from "../../services/services.types";

interface NotificationCardProps {
  notification: NotificationData;
  channels: ChannelsDto[];
}

function NotificationCard(props: NotificationCardProps) {
  const { notification, channels } = props;

  const handleRedirect = () => {
    if (!notification.link) return;

    window.open(notification.link, "_blank");
  };

  const getLogo = (logo: string) => {
    if (!logo) return "";
    return `data:image/png;base64, ${logo}`;
  };

  const isChennelVerified = (appId: string) => {
    return channels.find((c) => c.app_id === appId)?.verified || false;
  };

  return (
    <CardLayout
      mt={5}
      p={5}
      onClick={handleRedirect}
      cursor={notification.link ? "pointer" : "-moz-initial"}
      _hover={{ border: ".5px solid lightblue" }}
    >
      <Box display={"flex"} alignItems={"center"}>
        <Avatar
          name={notification.channel_name}
          src={getLogo(notification?.logo || "")}
          height={45}
          width={45}
        />
        <Text
          fontWeight={notification.seen ? 500 : 600}
          fontSize={"lg"}
          color={notification.seen ? "gray.500" : "white"}
          textAlign={"left"}
          ml={3}
        >
          {notification.channel_name}
        </Text>
        {isChennelVerified(notification.app_id) && (
          <Icon ml={3} as={VerifyIcon} h={6} w={6} />
        )}
        <Text ml={5} fontWeight={600} as="small" color="gray.600">
          {notification.kind === "public" ? "Annoucement" : "Notifications"}
        </Text>
        {notification.link && (
          <Icon ml={3} as={LinkIcon} height={5} width={5} />
        )}
        {!notification.seen && (
          <Text
            ml={2}
            as="span"
            height={2}
            width={2}
            borderRadius={"full"}
            bgColor={"blue.500"}
          />
        )}
      </Box>
      <Text
        color={notification.seen ? "gray.500" : "white"}
        as="p"
        textAlign={"left"}
        lineHeight={1.3}
        whiteSpace={'break-spaces'}
        fontSize={"md"}
        fontWeight={500}
        p={2}
      >
        {notification.message}
      </Text>
      <Text
        as={"p"}
        textAlign={"right"}
        fontSize={"sm"}
        fontWeight={600}
        color={notification.seen ? "gray.500" : "white"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-end"}
      >
        {moment(notification.created_time).format("LLL")}
      </Text>
    </CardLayout>
  );
}

export default React.memo(NotificationCard);
