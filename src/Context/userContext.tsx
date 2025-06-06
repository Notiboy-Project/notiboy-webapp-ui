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
    Email: {
      ID: string;
      Verified: boolean;
    };
    Discord: {
      ID: string;
      Verified: boolean;
    };
  }
  supported_mediums: string[];
  privileges: {
    channel_count: number
    channel_read_sent_analytics: boolean
    charge: number
    notification_char_count: number
    notification_count: number
    notification_retention: number
    optin_optout_analytics: boolean
    notification_max_schedule: number
  }
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
  saveUsersData: () => { },
  refetchUserInfo: () => { }
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
    if (!user?.chain) {
      return null;
    }

    try {
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
