type AddressHash = `0x${string}`;

type WorkFormValue = {
  id?: number;
  title: string;
  cover: string;
  price: number;
  description: string;
  badgeContract?: string;
  content?: string;
};

type WorkListItem = Required<WorkFormValue> & {
  listing: boolean;
  bought: boolean;
};

type BoughtWork = Pick<WorkListItem, 'id' | 'title' | 'cover' | 'description'> & {
  boughtAt: bigint;
}

type DonationRecord = {
  donator: AddressHash;
  amount: bigint;
  donatedAt: bigint;
};

type Donator = Omit<DonationRecord, 'donatedAt'> & {
  tokenId: bigint;
};

type Buyer = {
  buyer: AddressHash;
  soldAt: bigint;
};

export type { AddressHash, WorkFormValue, WorkListItem, BoughtWork, DonationRecord, Donator, Buyer }
