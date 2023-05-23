import api, { apiURL } from './api.service';

export const fetchUserInfo = async (chain: string, address: string) => {
  const resp = await api.get(apiURL.getUserInfoUrl(chain, address));
  return resp.data;
};

export const verifyEmail = async (
  chain: string,
  address: string,
  email: string
) => {
  const resp = await api.post(apiURL.verifyMediumUrl(chain, address, 'email'), {
    medium_address: email
  });
  return resp.data;
};
