export type Item = {
  id: string,
  name: string,
  image: string
  location: string,
  tags: string[]
};

export type NewItem = {
  name: string,
  image: Blob,
  location: string,
  tags?: string[],
  userId: string
}