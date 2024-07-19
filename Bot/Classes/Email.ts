import nodemailer from 'nodemailer';

export class Email {
  private message: string = "";
  private email: string = "";
  private subject: string = "";
  private transporter: nodemailer.Transporter;

  constructor(transporter: nodemailer.Transporter) {
    this.transporter = transporter;
  }

  public async sendEmail(message: string, email: string, subject: string): Promise<void> {
    this.setMessage(message);
    this.setEmail(email);
    this.setSubject(subject);

    await this.structureEmail(this.getMessage(), this.getEmail(), this.getSubject());
  }

  protected async structureEmail(message: string, email: string, subject: string): Promise<void> {
    const mailOptions = {
      from: ' "Prol Educa" <kevison.pascoal@gmail.com>', // kevison.pascoal@gmail.com substitua pelo seu e-mail
      to: email,
      subject: subject,
      html: message,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('E-mail enviado: %s', info.messageId);
    } catch (error) {
      
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
        console.log("Aplicação finalizada para contenção de erro.");
        process.exit(1);
      }
    }
  }

  private setMessage(message: string): void {
    this.message = message;
  }

  private setEmail(email: string): void {
    this.email = email;
  }

  private setSubject(subject: string): void {
    this.subject = subject;
  }

  private getMessage(): string {
    return this.message;
  }

  private getEmail(): string {
    return this.email;
  }

  private getSubject(): string {
    return this.subject;
  }
}