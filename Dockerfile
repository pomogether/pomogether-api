ARG NODE_VERSION=20.14.0

# Alpine image
FROM node:${NODE_VERSION}-alpine AS alpine
WORKDIR /app


# Setup pnpm and turbo on the alpine base
FROM alpine as base
RUN apk update
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN pnpm config set store-dir ~/.pnpm-store

# Build the project
FROM base AS builder

COPY . .

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base as prod-deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --prod --frozen-lockfile

FROM alpine as runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app

COPY --from=prod-deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/build .

ARG PORT=8080

ENV TZ=UTC NODE_ENV=production
ENV PORT=${PORT} HOST=0.0.0.0
ENV LOG_LEVEL=info APP_KEY=
ENV DB_HOST= DB_PORT= DB_USER= DB_PASSWORD= DB_DATABASE=

EXPOSE ${PORT}

CMD [ "node", "bin/server.js" ]
