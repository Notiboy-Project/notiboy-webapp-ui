import api, { apiURL } from "./api.service"


export const fetchUserInfo = async (chain: string, address: string) => {
  const resp = await api.get(apiURL.getUserInfoUrl(chain, address))
  return resp.data
}