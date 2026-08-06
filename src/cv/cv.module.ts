import { DynamicModule, Module } from '@nestjs/common';
import {
  workerControllers,
  workerImports,
  workerProviders,
} from './worker-module.config';
import { apiControllers, apiImports, apiProviders } from './api-module.config';
import { RouterModule } from '@nestjs/core';

@Module({})
export class CvModule {
  static register(mode: 'API' | 'WORKER'): DynamicModule {
    switch (mode) {
      case 'API':
        return {
          module: CvModule,
          imports: [
            RouterModule.register([
              {
                path: 'cvs',
                module: CvModule,
              },
            ]),
            ...apiImports,
          ],
          controllers: apiControllers,
          providers: apiProviders,
        };

      case 'WORKER':
        return {
          module: CvModule,
          imports: workerImports,
          controllers: workerControllers,
          providers: workerProviders,
        };

      default:
        throw new Error(`System Mode '${mode as string}' not found`);
    }
  }
}
