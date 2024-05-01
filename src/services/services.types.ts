import { NotificationData } from '../pages/Notifications/notification.types';
import { MessageType } from '../pages/Send/send.types';

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
  status: string;
  created_timestamp: string;
  chain: string;
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
export type ScheduledNotificationDto = {
  message: string;
  link: string;
  schedule: string;
  sender: string;
  channel: string;
  type: 'public' | 'private';
  UUID: string;
  createdTime: string;
  channelName: string;
  logo: string;
  receivers: any;
  updatedTime: string;
};

export type KindType = 'public' | 'private';

export interface sendNotificationPayload {
  receivers?: string[] | null;
  message: string;
  link: string;
  schedule?: string;
}

export interface sendNotificationArgs {
  chain: string;
  appId: string;
  kind: 'public' | 'private';
  address: string;
  payload: sendNotificationPayload;
}

export type scheduledNotificationArgs = {
  chain: string;
  uuid: string;
  scheduledTime: string;
  payload: sendNotificationPayload & { type: string };
};

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

export interface UserBillingResponse {
  status_code: number;
  message: string;
  data: UserBillingDto;
}

export interface UserBillingDto {
  address: string;
  chain: string;
  expiry: string;
  last_updated: string;
  membership: string;
  balance: number;
  remaining_notifications: number;
  billing_records: [];
  blocked_channels: string[];
}

export interface PaymentHistoryDto {
  paid_amount: number;
  paid_time: string;
  txn_id: string;
}

export enum PlansConfig {
  CHANNEL_COUNT = 'channel_count',
  CHARGE = 'charge',
  NOTIFICATION_CHAT_COUNT = 'notification_char_count',
  NOTIFICATION_COUNT = 'notification_count'
}

export interface MembershipDataResonse {
  data: PlanCountsDto;
  message: string;
  status_code: number;
}

export interface PlandConfigDto {
  channel_count: PlanCountsDto;
  charge: PlanCountsDto;
  notification_char_count: PlanCountsDto;
  notification_count: PlanCountsDto;
  notification_retention: PlanCountsDto;
  optin_optout_analytics: PlanCountsDto;
}

export interface PlanCountsDto {
  bronze: number | boolean;
  free: number | boolean;
  gold: number | boolean;
  silver: number | boolean;
}

///******** */
