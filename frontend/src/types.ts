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
  location: string;
  category?: CategoryType;
  tags: TagType[];
  createdAt: string;
  createdBy: UserType;
};

export type MessageType = {
  id: number;
  content: string;
  createdAt: string;
  createdBy: UserType;
};

export type CategoryType = {
  id: number;
  name: string;
  ads?: AdType[];
};

export type UserType = {
  id: number;
  email: string;
};
