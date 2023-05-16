import api, { apiURL } from "./api.service"
import { Fetcher } from "swr";
import { ChannelListsResponse, createChannelParams } from "./services.types";

export const fetchChannelLists: Fetcher<ChannelListsResponse> = async (args: string) => {
  const chain = args.split('/')[2]
  const resp = await api.get(apiURL.channelListsURL(chain));
  return resp.data
}

export const createChannel = async (chain: string, payload: createChannelParams) => {
  const resp = await api.post(apiURL.createChannelURL(chain), payload);
  return resp.data
}

export const fetchChannelUsersLists = async (chain: string, channel: string) => {
  const resp = await api.get(apiURL.channelUsersListsUrl(chain, channel));
  return resp.data
}

export const deleteChannel = async (chain: string, appId: string) => {
  const resp = await api.delete(apiURL.deleteChannelUrl(chain, appId))
  return resp.data
}

export const optIntoChannel = async (chain: string, appId: string, address: string) => {
  const resp = await api.post(apiURL.channelOptInUrl(chain, appId, address))
  return resp.data
}

export const optOutChannel = async (chain: string, appId: string, address: string) => {
  const resp = await api.delete(apiURL.channelOptOutUrl(chain, appId, address))
  return resp.data
}