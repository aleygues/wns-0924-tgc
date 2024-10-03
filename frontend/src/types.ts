export type TagType = {
  id: number;
  name: string;
};

export type AdType = {
  id: number;
  title: string;
  price: number;
  picture: string;
  description: string;
  owner: string;
  location: string;
  category?: CategoryType;
  tags: TagType[];
};

export type CategoryType = {
  id: number;
  name: string;
  ads: AdType[];
};
