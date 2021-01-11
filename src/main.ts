import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import { FastifyAdapter, NestFastifyApplication, } from '@nestjs/platform-fastify';
import * as helmet from 'fastify-helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as morgan from 'morgan';
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { logger: true });
  const configService = app.get(ConfigService);
  const PORT = configService.get('port')
  app.register(helmet.fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [`'self'`],
        styleSrc: [`'self'`, `'unsafe-inline'`],
        imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
        scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
      },
    },
  });
  app.use(morgan('tiny'));
  const options = new DocumentBuilder()
    .setTitle('API Specification')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);
  const url = await app.getUrl()
  console.log('Running on : ', url)
}
bootstrap();
