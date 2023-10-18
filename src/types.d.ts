export type UserCredentials = {
  nickname: string;
  password: string;
};

export type NewLocation = {
  name: string;
  parentId?: string;
  userId: string;
};

export type Location = {
  id: string;
  name: string;
  hasChildren: boolean;
};

export type LocationWithChildren = {
  id: string;
  name: string;
  children: LocationWithChildren[];
};

export type NewItem = {
  name: string;
  image: Blob;
  locationId?: string;
  tags?: string[];
  userId: string;
};

export type Item = {
  id: string;
  name: string;
  image: string;
  location: string | null;
  tags: string[];
};

export type DeleteItem = {
  userId: string;
  itemId: string;
};
