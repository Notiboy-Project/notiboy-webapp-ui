import api, { apiURL } from './api.service';
import { Fetcher } from 'swr';
import { NotificationFetcher, sendNotificaitonArgs } from './services.types';

export const fetchNotifications: Fetcher<NotificationFetcher> = async (
  args: any
) => {
  const { params } = args;
  const resp = await api.get(apiURL.fetchnotificationUrl(params.chain));
  return resp.data;
};

export const sendNotificaiton = async (args: sendNotificaitonArgs) => {
  const { chain, appId, kind, payload } = args
  const resp = await api.post(
    apiURL.sendNotificationUrl(chain, appId, kind),
    payload
  );
  return resp?.data;
};