export interface NotificationData {
  message: string;
  link: string;
  channel_name: string
  app_id: string;
  created_time: string;
  hash: string;
  uuid: string;
  kind: string;
  seen: boolean;
  logo?: string
}
