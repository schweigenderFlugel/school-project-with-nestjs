import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NodemailerService {
  constructor(private readonly mailerService: MailerService) {}

  async forSigningUp(email: string, code: string): Promise<void> {
    const link = 'http://localhost:3000'
    await this.mailerService.sendMail({
      to: 'Welcome <noreply@gmail.com>',
      from: email,
      subject: 'Bienvenido',
      template: 'welcome',
      context: {
        email,
        link,
        code,
      },
    });
  }

  async forRecoveringPassword(link: string, code: string, email: string) {
    await this.mailerService.sendMail({
      to: 'Recovery password <noreply@gmail.com>',
      from: email,
      subject: 'Recuperación de contraseña',
      template: 'recovery-password',
      context: {
        code,
        link,
      }
    })
  }
}
