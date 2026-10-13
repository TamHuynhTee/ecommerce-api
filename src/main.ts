import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(new LoggingMiddleware().use);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Only apply those properties defined in DTO
      forbidNonWhitelisted: true, // Throw an error if there is any extra property out of the DTO
      transform: true, // Make sure the request data is an instance of the DTO
    }),
  );
  await app.listen(8100);
}
bootstrap();
