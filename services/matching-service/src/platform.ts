import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware
} from '@nestjs/common';
import { randomUUID } from 'crypto';

type NextFunction = () => void;
type Request = {
  headers: Record<string, string | string[] | undefined>;
  method: string;
  originalUrl?: string;
  url: string;
};
type Response = {
  setHeader(name: string, value: string): void;
  on(event: 'finish', listener: () => void): void;
  statusCode: number;
  status(statusCode: number): { json(payload: unknown): void };
};

export interface ServiceConfig {
  corsOrigin: string;
  databaseUrl: string;
  jwtSecret: string;
  port: number;
  serviceName: string;
}

export interface RequestWithId extends Request {
  requestId?: string;
}

export function loadServiceConfig(defaultServiceName: string): ServiceConfig {
  const missing = ['CORS_ORIGIN', 'DATABASE_URL', 'JWT_SECRET', 'PORT', 'SERVICE_NAME'].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return {
    corsOrigin: process.env.CORS_ORIGIN!,
    databaseUrl: process.env.DATABASE_URL!,
    jwtSecret: process.env.JWT_SECRET!,
    port: Number(process.env.PORT),
    serviceName: process.env.SERVICE_NAME || defaultServiceName
  };
}

export function writeLog(serviceName: string, level: 'info' | 'warn' | 'error', message: string, context: Record<string, unknown> = {}) {
  process.stdout.write(
    `${JSON.stringify({
      timestamp: new Date().toISOString(),
      serviceName,
      level,
      message,
      ...context
    })}\n`
  );
}

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly serviceName: string) {}

  use(req: RequestWithId, res: Response, next: NextFunction) {
    const headerRequestId = req.headers['x-request-id'];
    req.requestId = Array.isArray(headerRequestId) ? headerRequestId[0] : headerRequestId || randomUUID();
    res.setHeader('x-request-id', req.requestId);
    const startedAt = Date.now();

    res.on('finish', () => {
      writeLog(this.serviceName, 'info', 'request.completed', {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl || req.url,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  }
}

@Catch()
export class UnifiedExceptionFilter implements ExceptionFilter {
  constructor(private readonly serviceName: string) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<RequestWithId>();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionBody = exception instanceof HttpException ? exception.getResponse() : undefined;
    const message =
      typeof exceptionBody === 'object' && exceptionBody && 'message' in exceptionBody
        ? Array.isArray((exceptionBody as { message: unknown }).message)
          ? (exceptionBody as { message: string[] }).message.join('; ')
          : String((exceptionBody as { message: unknown }).message)
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const payload = {
      success: false,
      code: `HTTP_${status}`,
      message,
      requestId: request.requestId || randomUUID(),
      timestamp: new Date().toISOString()
    };

    writeLog(this.serviceName, status >= 500 ? 'error' : 'warn', 'request.failed', {
      requestId: payload.requestId,
      method: request.method,
      path: request.originalUrl || request.url,
      statusCode: status,
      error: message
    });

    response.status(status).json(payload);
  }
}
