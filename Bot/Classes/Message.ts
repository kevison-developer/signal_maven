import * as axios from "axios";

export class Message {
  private message: string = "";
  private phone: string = "";
  private contactPhone: string = ""; // Added contactPhone property
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
    // const link_image = "https://querobolsadeestudos.com.br/portal-novo//img/proleduca.png";
    // const link_image = ""
    // const link_url = "https://proleduca.com.br/resultados.php?curso=Enfermagem";
    const link_url = "https://proleduca.com.br";

    try {
      const response = await axios.default.post(URL, {
        phone: `55${phone}`,
        message,
        image: "",
        linkUrl: "",
        title: "Prol Educa",
        linkDescription: "Prol Educa"
      }, {
        headers: {
          "content-type": "application/json",
          "client-token": "F560327e6db474535b37b419784483718S"
        }
      });

      // console.log(response);
      console.log(response.config.data);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendButtonWithMessage(message: string, phone: string): Promise<void> {
    this.setMessage(message);
    this.setPhone(phone);

    await this.structureButtonWithMessage(this.getMessage(), this.getPhone(), this.getURL());
  }

  protected async structureButtonWithMessage(message: string, phone: string, URL: string) {
    const link_image = "https://querobolsadeestudos.com.br/portal-novo//img/proleduca.png";
    const link_url = "https://icltank.com.br/prol-educa/";

    try {
      const response = await axios.default.post(URL, {
        phone: `55${phone}`,
        message,
        title: "Faça a DIFERENÇA na vida de CRIANÇAS através da EDUCAÇÃO!",
        footer: '',
        buttonActions: [
          {id: '2', type: 'URL', url: link_url, label: 'VOTE AGORA NO PROL EDUCA!'},
        ]

      }, {
        headers: {
          "content-type": "application/json",
          "client-token": "F560327e6db474535b37b419784483718S"
        }
      });

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  public async sendContact(contactPhone: string, phone: string): Promise<void> {
    this.setContactPhone(contactPhone);
    this.setPhone(phone);

    await this.structureContact(this.getContactPhone(), this.getPhone(), this.getURL());
  }

  protected async structureContact(contactPhone: string, phone: string, URL: string): Promise<void> {
    try {
      const response = await axios.default.post(URL, {
        phone: `55${contactPhone}`,
        contactName: "Atendimento Renovação",
        contactPhone: `55${phone}`,
        contactBusinessDescription: " "
      }, {
        headers: {
          "content-type": "application/json",
          "client-token": "F560327e6db474535b37b419784483718S"
        }
      });

      console.log(response.data);
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

  private setContactPhone(contactPhone: string): void {
    this.contactPhone = contactPhone;
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

  private getContactPhone(): string {
    return this.contactPhone;
  }

  private getURL(): string {
    return this.URL;
  }
}
