import { Connection } from '../Library/Connection';

interface PackageMessage {
  error: boolean;
  message: string;
}

export class Leads extends Connection {
  public async sqlSelect(QUERY: string): Promise<any[]> {
    try {
      const result: any = await this.control.query(QUERY);
      if (Array.isArray(result)) {
        return result;
      } else {
        return [result]; // Se não for um array, transformamos em um array de um único elemento
      }
    } catch (error: any) {
      throw new Error(`Erro ao executar a consulta SQL: ${error.message}`);
    }
  }

  public async sqlInsert(QUERY: string, packageMessage: PackageMessage): Promise<any> {
    try {
      const result: any = await this.control.query(QUERY);
      if (!result) {
        packageMessage.error = true;
        packageMessage.message = 'Verifique novamente os dados enviados para o sistema!';
      } else {
        packageMessage.error = false;
        packageMessage.message = 'Produto adicionado com sucesso no servidor!';
      }
      return packageMessage;
    } catch (error: any) {
      packageMessage.error = true;
      packageMessage.message = 'Falha na conexão com servidor. Tente mais tarde!';
      return packageMessage;
    }
  }

  public async sqlUpdate(QUERY: string, packageMessage: PackageMessage): Promise<any> {
    try {
      const result: any = await this.control.query(QUERY);
      if (!result) {
        packageMessage.error = true;
        packageMessage.message = 'Verifique novamente os dados enviados para o sistema!';
      } else {
        packageMessage.error = false;
        packageMessage.message = 'Produto adicionado com sucesso no servidor!';
      }
      return packageMessage;
    } catch (error: any) {
      packageMessage.error = true;
      packageMessage.message = 'Falha na conexão com servidor. Tente mais tarde!';
      return packageMessage;
    }
  }
}