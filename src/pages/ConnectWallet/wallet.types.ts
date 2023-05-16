

export interface Network {
  name: NetworkType;
  Icon: React.ReactElement;
  title: string;
}

export enum NetworkType {
  ALGORAND = 'algorand',
  ETHEREUM = 'ethereum'
}