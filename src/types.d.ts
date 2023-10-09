export type UserCredentials =  {
  nickname: string,
  password: string
};

export type NewLocation = {
  name: string,
  parentId?: string,
  userId: string
};

export type NewItem = {
  name: string,
  image: Blob
  locationId?: string,
  tags?: string[],
  userId: string
};
