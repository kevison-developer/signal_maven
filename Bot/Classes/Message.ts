import * as axios from "axios";

export class Message {
  private message: string = "";
  private phone: string = "";
  protected URL: string = "";

  constructor(URL: string) {
    this.setURL(URL);
  }

  public async sendMessage(message: string, phone: string): Promise<void> {
    this.setMessage(message);
    this.setPhone(phone);

    await this.structureMessage(this.getMessage(), this.getPhone(), this.getURL());
  }

  protected async structureMessage(message: string, phone: string, URL: string): Promise<void> {
    const link_image = "https://querobolsadeestudos.com.br/portal-novo//img/proleduca.png";
    const link_url = "https://proleduca.com.br/";

    try {
      const response = await axios.default.post(URL, {
        phone: `55${phone}`,
        message,
        image: link_image,
        linkUrl: link_url,
        title: "Prol Educa",
        linkDescription: "Prol Educa"
      }, {
        headers: {
          "content-type": "application/json",
          "client-token": "F560327e6db474535b37b419784483718S"
        }
      });

      console.log(response.data); // ou faça algo com a resposta se necessário
    } catch (error) {
      console.error(error);
    }
  }

  private setMessage(message: string): void {
    this.message = message;
  }
  private setPhone(phone: string): void {
    this.phone = phone;
  }
  private setURL(URL: string): void {
    this.URL = URL;
  }

  private getMessage(): string {
    return this.message;
  }
  private getPhone(): string {
    return this.phone;
  }
  private getURL(): string {
    return this.URL;
  }
}