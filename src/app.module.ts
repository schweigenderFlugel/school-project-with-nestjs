import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import config from './config';
import { dataSourceOption } from './ormconfig';
import { NodemailerModule } from './modules/nodemailer/nodemailer.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DiscordAuthModule } from './modules/discord-auth/discord-auth.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DiscordAuthModule,
    ProfileModule,
    CloudinaryModule,
    NodemailerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOption,
        autoLoadEntities: true,
      }),
    }),
  ],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
