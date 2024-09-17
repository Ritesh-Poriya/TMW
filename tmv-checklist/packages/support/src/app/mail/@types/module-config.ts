import { ModuleMetadata } from '@nestjs/common';
import { EJSModuleAsyncOptions, IEJSOptions } from '../../ejs/@types';

export interface MailModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<MailModuleOptions> | MailModuleOptions;
  inject?: any[];
  ejsAsyncOptions?: EJSModuleAsyncOptions;
}

export interface MailModuleOptions {
  ejsConfig: IEJSOptions;
  fromMail: string;
  transportConfig: TransporterConfig;
}

export type TransporterConfig = GmailTransportOptions | SMTPTransportOptions;

type GmailTransportOptions = {
  service: 'gmail';
  auth: {
    user: string;
    pass: string;
  };
};
type SMTPTransportOptions = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};
