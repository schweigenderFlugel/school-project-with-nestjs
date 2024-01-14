import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: 'Welcome <noreply@gmail.com>',
      from: email,
      subject: 'Bienvenido',
      template: 'welcome',
      context: {
        email,
      }
    })
  }
}