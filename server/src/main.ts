import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //use default exception handler, does not need to specify bc latest version of Nestjs will use it automatically. If we keep app.useGlobalFilters, validation error will not show, it will fallback to Internal Server Error
  //app.useGlobalFilters(new BaseExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 9000);
}
bootstrap();
