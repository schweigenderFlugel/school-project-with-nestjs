import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscordAuthController } from './discord-auth.controller';
import { DiscordStrategy } from './strategies/discord.strategy';
import { DiscordAuthService } from './discord-auth.service';

@Module({
    imports: [HttpModule],
    controllers: [DiscordAuthController],
    providers: [DiscordStrategy, DiscordAuthService]
})

export class DiscordAuthModule {}