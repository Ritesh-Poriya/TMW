import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { DbConnectionHealthIndicator } from './db-connection-health.indicator';
import { dbQueryRunnerProvider } from './db-query-runner.provider';
import { DbModuleAsyncOptions } from './@types';
import { DATA_SOURCE, DB_OPTIONS } from './constants';
import { DataSource, DataSourceOptions } from 'typeorm';

@Global()
@Module({})
export class DbModule {
  static forRootAsync(asyncOptions: DbModuleAsyncOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [
        DbModule.createAsyncOptionsProviders(asyncOptions),
        DbModule.createAsyncClientProvider(),
        dbQueryRunnerProvider,
        DbConnectionHealthIndicator,
      ],
      exports: [
        DbConnectionHealthIndicator,
        dbQueryRunnerProvider,
        DATA_SOURCE,
      ],
    };
  }

  private static createAsyncOptionsProviders(
    options: DbModuleAsyncOptions,
  ): Provider {
    return {
      provide: DB_OPTIONS,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };
  }

  private static createAsyncClientProvider(): Provider {
    return {
      provide: DATA_SOURCE,
      useFactory: async (options: DataSourceOptions) => {
        const datasource = new DataSource(options);
        return await datasource.initialize();
      },
      inject: [DB_OPTIONS],
    };
  }
}
