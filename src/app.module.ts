import { Logger, Module } from '@nestjs/common';
import { ConfigModule, registerAs } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import {
  configuration as defaultConfig,
  validationSchema as defaultValidationSchema,
} from './config/default.config';
import { LoggingInterceptor } from './interceptors/logging/logging.interceptor';
import { ValidationPipe } from './pipe/validation/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : '.env.production',
      load: [registerAs('default', defaultConfig)],
      validationSchema: Joi.object(Object.assign(defaultValidationSchema)),
    }),
  ],
  controllers: [AppController],
  providers: [
    Logger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
