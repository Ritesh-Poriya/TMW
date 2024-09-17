# Checklist - Backend NestJs
## Quality Gate
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=TMV-Holdings_tmv-checklist&metric=alert_status&token=037270cbda2d859e3b39fc505b8f52a7c678d775)](https://sonarcloud.io/summary/new_code?id=TMV-Holdings_tmv-checklist)
## Project Info

This project is based on microservices using nx monorepo

## Installation

### Clone the Project

Clone the "tmv-checklist" project repository to your local machine:

```bash
git clone git@github.com:tmv-holdings/tmv-checklist.git
```

### Install Dependencies

Navigate to the project directory and install the required dependencies:

```bash
cd tmv-checklist
npm install
```

**Note:** Create a `.env` file from the provided reference `.env.example` for project configuration.

## Run Project

- This project consists of multiple services located inside the `package` folder, each with its own `package.json`.
- Services include:
  - Auth
  - Media
  - Template

To Configure `auth` service configration `.env`:

```
### Blocking Configuration
ENABLE_BLOCKING=

### Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_DB=

### Crypto Configuration
CRYPTO_ALGORITHM=
SERVICE_ACCOUNT_PATH=
CRYPTO_KEYPHRASS=
CRYPTO_PRIVATE_KEY=
CRYPTO_PUBLIC_KEY=
CRYPTO_PUBLIC_KEY_PATH=
CRYPTO_PRIVATE_KEY_PATH=
HASHING_SALT=

### Host Configration
SUPER_ADMIN_HOSTNAME=
SUPER_ADMIN_VERIFY_EMAIL_SUCCESS_REDIRECT_URL=
SUPER_ADMIN_VERIFY_EMAIL_FAILURE_REDIRECT_URL=
SUPER_ADMIN_PASSWORD_RESET_URL=

### JWT Configuration
JWT_ACCESS_EXPIRES_IN=
JWT_REFRESH_EXPIRES_IN=
JWT_ISSUER=
AUTH_ACCESS_TOKEN_ISSUER=
AUTH_PRIVATE_KEY_PATH=
AUTH_PUBLIC_KEY_PATH=

### Mailer Configuration
TRANSPORT_TYPE= # smtp or gmail
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASSWORD=
FROM_MAIL=

### NATS Configuration
NATS_CLUSTER_ID=
NATS_CLIENT_ID=
NATS_URL=

### Password Reset Configuration
PASSWORD_RESET_DELIMITER=
PASSWORD_RESET_LINK_EXPIRY=

### Postgress configuration
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_MIGRATION_TABLE_NAME=

### ReCaptcha Enterprise Configuration
GCP_PROJECT_ID=
CAPTCHA_KEY=
CAPTCHA_ACCEPTABLE_SCORE=

### Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_DB=
```

To run `auth` service:

1. Navigate to the service directory and install the required dependencies:

```bash
cd package/auth
npm install
npm run start:dev # start service in development mode
```

**Note** You can find all available commands in each service's `package.json` file.

To Configure `media` service configration `.env`:

```bash
### GCP Service Account Path
GCP_SERVICE_ACCOUNT_KEY_PATH=
GCP_BUCKET_NAME=
```

To run `media` service:

2. Navigate to the service directory and install the required dependencies:

```bash
cd package/media
npm install
npm run start:dev # start service in development mode
```

**Note** You can find all available commands in each service's `package.json` file.

To Configure `template` service configration `.env`:

```bash
### Authorization Endpoint
AUTHORIZATION_ENDPOINT=http://localhost:3000/api/auth/authorize

### NATS Configuration
NATS_CLUSTER_ID=
NATS_CLIENT_ID=
NATS_URL=

### Postgress configuration
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
DB_MIGRATION_TABLE_NAME=
```

To run `template` service:

3. Navigate to the service directory and install the required dependencies:

```bash
cd package/template
npm install
npm run start:dev # start service in development mode
```

**Note** You can find all available commands in each service's `package.json` file.
