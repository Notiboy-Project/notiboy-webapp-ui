import api, { apiURL } from "./api.service"
import { Fetcher } from "swr";
import { ChannelListsResponse, NotificationFetcher, createChannelParams } from "./services.types";

export const fetchNotifications: Fetcher<NotificationFetcher> = async (args: any) => {
  const { params } = args;
  const resp = await api.get(apiURL.fetchnotificationUrl(params.chain))
  return resp.data
}

export const fetchChannelLists: Fetcher<ChannelListsResponse> = async (args: string) => {
  const chain = args.split('/')[2]
  console.log("chain ==>", chain)
  const resp = await api.get(apiURL.channelListsURL(chain));
  return resp.data
}

export const createChannel = async (chain: string, payload: createChannelParams) => {
  const resp = await api.post(apiURL.createChannelURL(chain), payload);
  return resp.data
}