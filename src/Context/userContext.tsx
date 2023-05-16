
import * as React from 'react';
import { NetworkType } from '../pages/ConnectWallet/wallet.types';
import { storageKey } from '../config';

export type UserDto = {
  address: string,
  allowed_mediums: string[],
  chain: NetworkType,
  channels: string[],
  logo: string,
  membership: string,
  optins: string[],
  status: string,
  supported_mediums: string[]
}

export type UserContextTypes = {
  user: UserDto | null
  status: ContextStatus,
  saveUsersData: (user: UserDto) => void
}

export enum ContextStatus {
  INITIALIZING = 'initializing',
  DONE = 'done',
}

export const UserContext = React.createContext<UserContextTypes>({
  user: null,
  status: ContextStatus.INITIALIZING,
  saveUsersData: () => { }
});

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<UserDto | null>(null)
  const [status, setStatus] = React.useState<ContextStatus>(ContextStatus.INITIALIZING)

  const saveUsersData = (data: UserDto) => {
    localStorage.setItem(storageKey.USER_DATA_KEY, JSON.stringify(data))
    setUser(data)
    setStatus(ContextStatus.DONE)
  }

  React.useEffect(() => {
    const userString = localStorage.getItem(storageKey.USER_DATA_KEY) || 'null';
    const data = JSON.parse(userString);
    if (data) {
      setUser(data)
      setStatus(ContextStatus.DONE)
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, saveUsersData, status }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider