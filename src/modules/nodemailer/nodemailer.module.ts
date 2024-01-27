import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NodemailerService } from './nodemailer.service';
import config from '../../config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => ({
        transport: {
          service: 'gmail',
          host: configService.nodemailerHost,
          secure: true,
          port: configService.nodemailerPort,
          tls: {
            rejectUnauthorized: false,
          },
          auth: {
            user: configService.nodemailerUser,
            pass: configService.nodemailerPass,
          },
        },
        template: {
          dir: process.cwd() + '/src/modules/nodemailer/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [NodemailerService],
  exports: [NodemailerService],
})
export class NodemailerModule {}
