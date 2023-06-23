import api, { apiURL } from './api.service';
import { Fetcher } from 'swr';
import { NotificationFetcher, sendNotificaitonArgs } from './services.types';

export const fetchNotifications: Fetcher<NotificationFetcher, { chain: string, params: string }> = async (
  args
) => {
  const { params, chain } = args;
  const resp = await api.get(apiURL.fetchnotificationUrl(chain, params));
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