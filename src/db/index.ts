import { createClient } from '@libsql/client';
import { Logger } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/libsql';
import { format } from 'sql-formatter';
import * as schema from './schema';

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_AUTH_TOKEN
});

class PrettyLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log(
      format(query, {
        language: 'sqlite',
        keywordCase: 'upper',
        tabWidth: 2,
        indentStyle: 'tabularRight',
        params: params.map((p) => String(typeof p == 'string' ? `"${p}"` : p))
      })
    );
  }
}

const db = drizzle(client, {
  schema,
  logger: process.env.NODE_ENV == 'development' && new PrettyLogger()
});

export default db;
