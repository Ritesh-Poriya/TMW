import { resolve } from 'path';
import { MailModuleOptions } from '../mail/@types';

const ejsTemplateDir = resolve(__dirname, '../../assets/templates/mail');

const VALID_TRANSPORT_TYPES = ['smtp', 'gmail'];
const VALID_SMTP_SECURE_VALUES = ['true', 'false'];

const validateEnvVarExists = (envVarName: string) => {
  if (!process.env[envVarName]) {
    throw new Error(`${envVarName} environment variable is not defined.`);
  }
};

const getSmtpMailConfig = (): MailModuleOptions => {
  validateEnvVarExists('TRANSPORT_TYPE');
  validateEnvVarExists('FROM_MAIL');
  validateEnvVarExists('SMTP_HOST');
  validateEnvVarExists('SMTP_PORT');
  validateEnvVarExists('SMTP_USER');
  validateEnvVarExists('SMTP_PASSWORD');

  const smtpSecure = process.env.SMTP_SECURE;
  validateEnvVarExists('SMTP_SECURE');
  if (!VALID_SMTP_SECURE_VALUES.includes(smtpSecure)) {
    throw new Error('SMTP_SECURE environment variable is invalid.');
  }

  return {
    transportConfig: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: smtpSecure === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    fromMail: process.env.FROM_MAIL,
    ejsConfig: {
      viewsDir: ejsTemplateDir,
    },
  };
};

const getGmailMailConfig = (): MailModuleOptions => {
  validateEnvVarExists('TRANSPORT_TYPE');
  validateEnvVarExists('FROM_MAIL');
  validateEnvVarExists('MAIL_USER');
  validateEnvVarExists('MAIL_PASSWORD');

  return {
    transportConfig: {
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    },
    fromMail: process.env.FROM_MAIL,
    ejsConfig: {
      viewsDir: ejsTemplateDir,
    },
  };
};

export const mailConfig = () => {
  const transportType = process.env.TRANSPORT_TYPE;
  validateEnvVarExists('TRANSPORT_TYPE');

  if (!VALID_TRANSPORT_TYPES.includes(transportType)) {
    throw new Error('TRANSPORT_TYPE environment variable is invalid.');
  }

  const mailConfig: MailModuleOptions =
    transportType === 'smtp' ? getSmtpMailConfig() : getGmailMailConfig();

  return { mailConfig };
};
