import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mw as requestIpMw } from 'request-ip';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { HttpExceptionsFilter } from 'src/common/filters/http-exceptions-filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { setupApiDocs } from 'src/common/utils/api-docs';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'istoken'],
    exposedHeaders: ['Content-Disposition'],
    credentials: true,
    maxAge: 3600,
  });

  const config = app.get(ConfigService);

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 1000,
    }),
  );

  const prefix = config.get<string>('app.prefix');
  const rootPath = process.cwd();
  const baseDirPath = join(rootPath, config.get('app.file.location'));
  const storageType = config.get<string>('app.file.storageType');

  if (storageType === 'minio') {
    const minioDomain = config.get<string>('minio.domain');
    app.use(
      '/profile/',
      createProxyMiddleware({
        target: minioDomain,
        changeOrigin: true,
        pathRewrite: path => path.replace(/^\/profile\//, '/'),
      }),
    );
  } else if (storageType === 'rustfs') {
    const rustfsDomain =
      config.get<string>('rustfs.domain') ||
      `http://${config.get<string>('rustfs.endPoint')}:${config.get<number>('rustfs.port')}`;
    app.use(
      '/profile/',
      createProxyMiddleware({
        target: rustfsDomain,
        changeOrigin: true,
        pathRewrite: path => path.replace(/^\/profile\//, '/'),
      }),
    );
  } else {
    app.useStaticAssets(baseDirPath, {
      prefix: '/profile/',
      maxAge: 0,
    });
  }

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new HttpExceptionsFilter());

  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`, 'cdn.redoc.ly', 'fonts.googleapis.com'],
          fontSrc: [`'self'`, 'fonts.gstatic.com', 'cdn.redoc.ly'],
          scriptSrc: [`'self'`, `'unsafe-inline'`, 'cdn.redoc.ly'],
          imgSrc: [`'self'`, 'data:', 'cdn.redoc.ly'],
          frameAncestors: [`'self'`, 'http://localhost:*', 'https://localhost:*'],
          upgradeInsecureRequests: null,
        },
      },
    }),
  );

  setupApiDocs(app, prefix, '#1890ff');

  app.use('/swagger-ui*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
  });

  app.use('/docs*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    next();
  });

  app.use(requestIpMw({ attributeName: 'ip' }));

  const port = config.get<number>('app.port') || 8080;
  await app.listen(port);

  console.log(
    `\n========================================`,
    `\n✅ Nest-Admin 服务启动成功`,
    `\n========================================`,
    `\n📍 服务地址：http://localhost:${port}${prefix}/`,
    `\n📖 Swagger UI: http://localhost:${port}${prefix}/swagger-ui/`,
    `\n📚 Redoc 文档：http://localhost:${port}${prefix}/docs`,
    `\n🔧 Apifox 导入：http://localhost:${port}/openapi.json`,
    `\n========================================\n`,
  );
}

bootstrap();
