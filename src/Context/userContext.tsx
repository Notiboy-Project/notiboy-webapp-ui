import * as React from 'react';
import { NetworkType } from '../pages/ConnectWallet/wallet.types';
import { storageKey } from '../config';
import { fetchUserInfo } from '../services/users.service';

export type UserDto = {
  address: string;
  allowed_mediums: string[];
  chain: NetworkType;
  channels: string[];
  logo: string;
  membership: string;
  optins: string[];
  status: string;
  medium_metadata: {
    [key: string]: {
      ID: string;
      Verified: boolean;
    };
  }[];
  supported_mediums: string[];
};

export type UserContextTypes = {
  user: UserDto | null;
  status: ContextStatus;
  saveUsersData: (user: UserDto) => void;
  refetchUserInfo: () => void;
};

export enum ContextStatus {
  INITIALIZING = 'initializing',
  DONE = 'done'
}

export const UserContext = React.createContext<UserContextTypes>({
  user: null,
  status: ContextStatus.INITIALIZING,
  saveUsersData: () => {},
  refetchUserInfo: () => {}
});

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = React.useState<UserDto | null>(null);
  const [status, setStatus] = React.useState<ContextStatus>(
    ContextStatus.INITIALIZING
  );

  const saveUsersData = (data: UserDto) => {
    localStorage.setItem(storageKey.USER_DATA_KEY, JSON.stringify(data));
    setUser(data);
    setStatus(ContextStatus.DONE);
  };

  const refetchUserInfo = async () => {
    // TODO: Call api and save user information.
    console.log('refetchUserInfo', user?.chain);
    if (!user?.chain) {
      return null;
    }

    try {
      console.log('Calling API', user?.chain);
      const resp = await fetchUserInfo(user?.chain || '', user?.address || '');
      saveUsersData(resp.data);
    } catch (err) {
      console.log('Error while refetching user info', err);
    }
  };

  React.useEffect(() => {
    const userString = localStorage.getItem(storageKey.USER_DATA_KEY) || 'null';
    const data = JSON.parse(userString);
    if (data) {
      setUser(data);
      setStatus(ContextStatus.DONE);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, saveUsersData, status, refetchUserInfo }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
