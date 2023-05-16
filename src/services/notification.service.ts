import api, { apiURL } from "./api.service"
import { Fetcher } from "swr";
import { NotificationFetcher } from "./services.types";

export const fetchNotifications: Fetcher<NotificationFetcher> = async (args: any) => {
  const { params } = args;
  const resp = await api.get(apiURL.fetchnotificationUrl(params.chain))
  return resp.data
}

