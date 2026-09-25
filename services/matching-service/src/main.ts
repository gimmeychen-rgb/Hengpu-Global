import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { loadServiceConfig, RequestLoggerMiddleware, UnifiedExceptionFilter } from './platform';

async function bootstrap() {
  const config = loadServiceConfig('matching-service');
  const app = await NestFactory.create(AppModule);
  const requestLogger = new RequestLoggerMiddleware(config.serviceName);
  app.enableCors({ origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',') });
  app.use(requestLogger.use.bind(requestLogger));
  app.useGlobalFilters(new UnifiedExceptionFilter(config.serviceName));
  await app.listen(config.port);
}
bootstrap();
