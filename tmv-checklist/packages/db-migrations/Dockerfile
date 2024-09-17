FROM node:20.11.0-alpine

RUN adduser -D nonroot

WORKDIR /app
COPY ./packages/db-migrations/package.json .
RUN npm install
COPY ./packages/db-migrations .
USER nonroot
