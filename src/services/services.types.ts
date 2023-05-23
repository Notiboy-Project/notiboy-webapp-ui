
import { NotificationData } from "../pages/Notifications/notification.types";


///*********** Channels APIs types ****/
export interface ChannelListsResponse {
  status_code: number;
  data: ChannelsDto[]
  messsage: string
}

export interface ChannelsDto {
  app_id: string
  description: string
  name: string
  logo: string
  owner: string
  verified: boolean
}

export interface createChannelParams {
  name: string;
  description: string;
  logo?: string | null
}

///********End Channels APIs types */

///*********** Notifications APIs types ****/

export interface NotificationFetcher {
  data: NotificationData[],
  status_code: string,
  message: string
}

export type KindType = 'public' | 'private'

export interface sendNotificationPaylod {
  user: string[];
  message: string;
  link: string;
}

export interface sendNotificaitonArgs {
  chain: string,
  appId: string,
  kind: 'public' | 'private',
  address: string
  payload: sendNotificationPaylod
}


///*********** END Notifications APIs types ****/