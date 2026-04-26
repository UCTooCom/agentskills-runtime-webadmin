import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { RequestMethod } from '@nestjs/common';

dotenv.config({ path: '.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置 CORS，允许前端直接调用 API
  app.enableCors({
    origin: '*', // 允许所有来源（开发环境）
    credentials: true,
  });

  app.setGlobalPrefix(process.env.GLOBAL_PREFIX || '/api', {
    exclude: [{ path: 'healthCheck', method: RequestMethod.GET }]
  });

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

