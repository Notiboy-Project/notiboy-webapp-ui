import api, { apiURL } from './api.service';
import { Fetcher } from 'swr';
import {
  ChannelListsResponse,
  ChannelsDto,
  createChannelParams
} from './services.types';

export const fetchChannelLists: Fetcher<
  ChannelListsResponse,
  { chain: string; param: string }
> = async (args) => {
  const { chain, param } = args
  const resp = await api.get(apiURL.channelListsURL(chain, param));
  const { data, status_code, message, pagination_meta_data } = resp?.data;
  // const verified = data?.filter((d: any) => d.verified === true);
  // const notVerified = data?.filter((d: any) => d.verified === false);
  return {
    data,
    status_code,
    message,
    pagination_meta_data
  };
};

export const createChannel = async (
  chain: string,
  payload: createChannelParams
) => {
  const resp = await api.post(apiURL.createChannelURL(chain), payload);
  return resp.data;
};

export const updateChannel = async (
  chain: string,
  appId: string,
  payload: { logo: string | null; description: string, name: string }
) => {
  const resp = await api.put(apiURL.updateChannelUrl(chain, appId), payload);
  return resp.data;
};

export const fetchChannelUsersLists = async (
  chain: string,
  channel: string
) => {
  const resp = await api.get(apiURL.channelUsersListsUrl(chain, channel));
  return resp.data;
};

export const deleteChannel = async (chain: string, appId: string) => {
  const resp = await api.delete(apiURL.deleteChannelUrl(chain, appId));
  return resp.data;
};

export const optIntoChannel = async (
  chain: string,
  appId: string,
  address: string
) => {
  const resp = await api.post(apiURL.channelOptInUrl(chain, appId, address));
  return resp.data;
};

export const optOutChannel = async (
  chain: string,
  appId: string,
  address: string
) => {
  const resp = await api.delete(apiURL.channelOptOutUrl(chain, appId, address));
  return resp.data;
};

export const fetchChannelsByUser: Fetcher<ChannelsDto[]> = async (
  args: string
) => {
  const [, chain, address] = args.split('/');
  const resp = await api.get(apiURL.channelsByUsersURL(chain, address));
  return resp?.data?.data || [];
};

export const fetchOptedInChannels: Fetcher<
  ChannelsDto[],
  { chain: string; address: string; logo: boolean }
> = async (params) => {
  const { chain, address, logo = false } = params;

  const resp = await api.get(
    apiURL.channelsByOptedIn(chain, address) +
      `${logo ? `?logo=true` : '?logo=false'}`
  );
  return resp?.data?.data || [];
};

export const fetchOwnedChannels: Fetcher<
  ChannelsDto[],
  { chain: string; address: string }
> = async (params) => {
  const { chain, address } = params;

  const resp = await api.get(
    apiURL.channelsByOwned(chain, address) + '?logo=true'
  );
  return resp?.data?.data || [];
};
