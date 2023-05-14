import api, { apiURL } from "./api.service"
import { NotificationData } from "../pages/Notifications/notification.types"

export interface NotificationFetcher {
  data: NotificationData[],
  status_code: string,
  message: string
}

export const fetchNotifications = async (args: any) => {
  const { params } = args;
  const resp = await api.get(apiURL.fetchnotificationUrl(params.chain))
  return resp.data
}

export const fetchChannelLists = async (args: string) => {
  const chain = args.split('/')[2]
  console.log("chain ==>", chain)
  const resp = await api.get(apiURL.channelListsURL(chain));
  return resp.data
}

interface createChannelParams {
  name: string;
  description: string;
  logo: any | null
}

export const createChannel = async (chain: string, payload: createChannelParams) => {
  const resp = await api.post(apiURL.createChannelURL(chain), payload);
  return resp.data
}