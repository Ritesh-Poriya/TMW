FROM node:20.11.0-alpine AS base

# Create a non-root user
RUN adduser -D nonroot

FROM base AS builder

# Set working directory
WORKDIR /app
COPY ./packages/media/package.json ./
RUN npm install --ignore-scripts
COPY ./packages/media .
RUN npm run build
USER nonroot

FROM base AS RUNNER
WORKDIR /app
COPY --from=builder /app/package.json .
RUN npm install --ommit=dev
COPY --from=builder /app/dist ./dist
RUN mkdir uploads
USER nonroot

CMD [ "npm", "run", "start:prod" ]