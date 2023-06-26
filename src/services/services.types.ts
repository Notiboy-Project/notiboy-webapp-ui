import { NotificationData } from '../pages/Notifications/notification.types';

///*********** Channels APIs types ****/
export interface ChannelListsResponse {
  status_code: number;
  data: ChannelsDto[];
  message: string;
  pagination_meta_data: {
    next: string;
    page_size: number;
    prev: string;
    size: number;
  };
}

export interface ChannelsDto {
  app_id: string;
  description: string;
  name: string;
  logo: string;
  owner: string;
  verified: boolean;
}

export interface createChannelParams {
  name: string;
  description: string;
  logo?: string | null;
}

///********End Channels APIs types */

///*********** Notifications APIs types ****/

export interface NotificationFetcher {
  data: NotificationData[];
  status_code: string;
  message: string;
  pagination_meta_data: {
    next: string;
    page_size: number;
    prev: string;
    size: number;
  };
}

export type KindType = 'public' | 'private';

export interface sendNotificationPaylod {
  receivers?: string[];
  message: string;
  link: string;
}

export interface sendNotificaitonArgs {
  chain: string;
  appId: string;
  kind: 'public' | 'private';
  address: string;
  payload: sendNotificationPaylod;
}

///*********** END Notifications APIs types ****/

////********* USERS profile API types */

export interface updateMediumPayload {
  allowed_mediums: string[];
}

export interface PatDTO {
  name: string;
  uuid: string;
  created: string;
}

export interface UsersPatFetcher {
  status_code: number;
  data: PatDTO[];
  message: string;
}

///******** */
