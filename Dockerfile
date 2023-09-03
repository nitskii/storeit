FROM oven/bun

WORKDIR /app

RUN curl -L https://get.tur.so/install.sh | bash

ENV NODE_ENV=production

COPY package.json .
COPY bun.lockb .

RUN bun install -p

COPY public public
COPY src src
COPY tsconfig.json tsconfig.json

EXPOSE 8080

CMD bun start