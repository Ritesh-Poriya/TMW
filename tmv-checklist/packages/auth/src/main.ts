import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NextFunction, Request, Response } from 'express';
import * as logger from './app/logger/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: logger.default,
  });
  app.setGlobalPrefix('/api/auth');
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  const swaggerConfig = new DocumentBuilder().setTitle('Auth API').build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/auth/docs', app, document);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(3000);
}
bootstrap();
