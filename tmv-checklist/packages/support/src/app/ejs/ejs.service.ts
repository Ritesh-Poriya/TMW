import { Inject, Injectable } from '@nestjs/common';
import { EJS_PROVIDER } from './constants';
import { IEJSOptions } from './@types';
import * as ejs from 'ejs';
import * as path from 'path';
import { logAround } from '../logger/decorator/log-around';

@Injectable()
export class EJSService {
  constructor(@Inject(EJS_PROVIDER) readonly ejsOptions: IEJSOptions) {}

  @logAround()
  public async render(template: string, data: any): Promise<string> {
    return new Promise((resolve, reject) => {
      ejs.renderFile(
        path.join(this.ejsOptions.viewsDir, template),
        {
          ...data,
          ...this.ejsOptions.defaultData,
        },
        this.ejsOptions.renderOptions,
        (err, str) => {
          if (err) {
            reject(err);
          } else {
            resolve(str);
          }
        },
      );
    });
  }
}
