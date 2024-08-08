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
}

export type { AddressHash, WorkFormValue, WorkListItem }
