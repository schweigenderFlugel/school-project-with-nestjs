import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import config from './config';
import { dataSourceOption } from './ormconfig';

@Module({
  imports: [
    UsersModule, 
    AuthModule,
    ProfileModule,
    CloudinaryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...dataSourceOption,
        autoLoadEntities: true,
      })
    })
  ],
})
export class AppModule {}
