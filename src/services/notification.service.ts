import api, { apiURL } from './api.service';
import { Fetcher } from 'swr';
import {
  NotificationFetcher,
  ScheduledNotificationDto,
  sendNotificationArgs
} from './services.types';

export const fetchNotifications: Fetcher<
  NotificationFetcher,
  { chain: string; params: string }
> = async (args) => {
  const { params, chain } = args;
  const resp = await api.get(apiURL.fetchNotificationUrl(chain, params));
  return resp.data;
};

export const sendNotification = async (args: sendNotificationArgs) => {
  const { chain, appId, kind, payload } = args;
  const resp = await api.post(
    apiURL.sendNotificationUrl(chain, appId, kind),
    payload
  );
  return resp?.data;
};

export const fetchScheduledNotification: Fetcher<
  ScheduledNotificationDto[],
  { chain: string; params: string }
> = async ({ chain, params }) => {
  const resp = await api.get(
    apiURL.fetchScheduledNotificationUrl(chain, params)
  );
  return resp?.data?.data || [];
};

export const deleteScheduled = async (
  chain: string,
  uuid: string,
  time: string
) => {
  const resp = await api.delete(apiURL.deleteScheduledUrl(chain, uuid, time));
  return resp?.data;
};
