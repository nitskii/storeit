import { InferModel } from 'drizzle-orm';
import { items } from '../db/schema';

export type Item = Omit<InferModel<typeof items> & { location: string, tags: string[] }, 'userId' | 'locationId'>;

export type NewItem = {
  name: string,
  image: Blob,
  location: string,
  tags: string[]
}