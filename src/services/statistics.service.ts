import api, { apiURL } from './api.service';
import { Fetcher } from 'swr';

export interface GlobalStatDto {
  users: number;
  notifications_sent: number;
  channels: number;
}

export interface GlobalStatResp {
  data: GlobalStatDto[];
  status_code: number;
  message: string;
}

export interface ChannelStatsDto {
  created: number;
  deleted: number;
  date: string;
}

export interface optinOutStatsDto {
  optin: number;
  optout: number;
  date: string;
}

export const fetchGlobalStats: Fetcher<GlobalStatResp> = async () => {
  const resp = await api.get(apiURL.getGlobalStatsUrl());
  return resp.data;
};

export const fetchUsersStat: Fetcher<{
  status_code: number;
  message: string;
  data: any[];
}> = async (args: string) => {
  const [chain] = args.split('/');
  const resp = await api.get(apiURL.getUsersStatsUrl(chain));
  return resp.data;
};

export const fethcChannelsStats: Fetcher<{
  status_code: number;
  message: string;
  data: ChannelStatsDto[];
}> = async (args: string) => {
  const [chain] = args.split('/');
  const resp = await api.get(apiURL.getChannelStatUrl(chain));
  return resp?.data;
};

export const fetchOptInOutStats: Fetcher<{
  status_code: number;
  message: string;
  data: optinOutStatsDto[];
}> = async (args: string) => {
  const [chain, channel] = args.split('/');
  const resp = await api.get(apiURL.getOptinOutStatUrl(chain, channel));
  return resp?.data;
};
