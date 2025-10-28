import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../frontend'),
      serveStaticOptions: {
        fallthrough: true,
      },
    }),
    ConfigModule.forRoot(),
    ScoresModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
