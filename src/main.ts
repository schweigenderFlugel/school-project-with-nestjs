import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }))

  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })

  const config = new DocumentBuilder()
    .addBearerAuth()
    .addCookieAuth('refresh_token')
    .setTitle('API')
    .setDescription('this an API for testing')
    .setVersion('1.0')
    .addTag('')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document);
  

  app.use(cookieParser());
  app.useGlobalInterceptors(new RequestInterceptor());
  await app.listen(3000);
}
bootstrap();
