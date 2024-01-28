import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordAuthController } from './discord-auth.controller';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DiscordAuthService } from './discord-auth.service';
import { DiscordAuthRepository } from './discord-auth.repository';
import { DiscordAuth } from './discord-auth.entity';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [HttpModule, ProfileModule, TypeOrmModule.forFeature([DiscordAuth])],
  controllers: [DiscordAuthController],
  providers: [DiscordStrategy, DiscordAuthService, DiscordAuthRepository],
})
export class DiscordAuthModule {}
