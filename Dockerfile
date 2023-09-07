FROM oven/bun

ENV NODE_ENV production

COPY package.json bun.lockb .

RUN bun install -p

USER bun

COPY --chown=bun:bun public public
COPY --chown=bun:bun src src
COPY --chown=bun:bun tsconfig.json tsconfig.json

EXPOSE 8080

CMD bun start