import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { NextFunction, Request, Response } from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as logger from './app/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger.default,
  });
  app.setGlobalPrefix('/api/template');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/') {
      console.log('Sending 200 status');
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const swaggerConfig = new DocumentBuilder().setTitle('Template API').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/template/docs', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3000);
}
bootstrap();
