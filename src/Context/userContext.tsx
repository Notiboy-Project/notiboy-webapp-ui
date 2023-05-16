
import * as React from 'react';

export type UserDto = {
  channels: string[]
  optins: string[]
  logo: string
  membership: string
  registered_mediums: string[],
  allowed_mediums: string[],
  status: string,
  last_seen_notification: string
}

export type ContextTypes = {
  chain: string
  user: UserDto | null
  setUser: (user: UserDto) => void
  setChain: (chain: string) => void
}

export const UserContext = React.createContext<ContextTypes | null>(null);

const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<UserDto | null>(null)
  const [chain, setChain] = React.useState<string>('')

  return (
    <UserContext.Provider value={{ user, chain, setUser, setChain }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider