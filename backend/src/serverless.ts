import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const expressApp = express();
let nestApp;

async function createNestApp() {
  if (!nestApp) {
    const adapter = new ExpressAdapter(expressApp);
    nestApp = await NestFactory.create(AppModule, adapter);
    nestApp.useGlobalPipes(new ValidationPipe());
    nestApp.setGlobalPrefix('api');
    await nestApp.init();
    console.log('Nest app initialized');
  }
  return expressApp;
}

export default async (req, res) => {
  console.log('Serverless function called:', req.method, req.url);
  const app = await createNestApp();
  return app(req, res);
};
