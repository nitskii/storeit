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

export type UpdateNameItem = {
  userId: string;
  itemId: string;
  name: string;
};

export type UpdateLocationItem = {
  userId: string;
  itemId: string;
  locationId: string;
};

export type UpdateTagsItem = {
  userId: string;
  itemId: string;
  tagName: string;
};

export type DeleteItem = {
  userId: string;
  itemId: string;
};
