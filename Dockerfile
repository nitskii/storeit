FROM oven/bun

WORKDIR /app

RUN curl -sSfL https://get.tur.so/install.sh | bash

ENV NODE_ENV=production

COPY package.json .
COPY bun.lockb .

RUN bun install -p

COPY public public
COPY src src
COPY drizzle.config.ts drizzle.config.ts
COPY tsconfig.json tsconfig.json
COPY .env .env

EXPOSE 8080

CMD bun start