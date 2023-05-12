import api, { apiURL } from "./api.service"
import { NotificationData } from "../pages/Notifications/notification.types"

export interface NotificationFetcher {
  data: NotificationData[],
  status_code: string,
  message: string
}

export const fetchNotifications = async (args: any) => {
  const { params } = args;
  const resp = await api.get(apiURL.notification(params.chain))
  return resp.data
}