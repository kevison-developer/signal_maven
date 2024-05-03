import { Connection } from '../Library/Connection';

export class Leads extends Connection {
  // Método para executar uma consulta SQL e retornar os resultados como um array de objetos simples
  public async query(sqlQuery: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.control.query(sqlQuery, (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Converter cada objeto RowDataPacket em um objeto simples
          const simplifiedResults = results.map((row: any) => ({ ...row }));
          resolve(simplifiedResults);
        }
      });
    });
  }

  // Método para executar uma instrução SQL de inserção
  public async insert(sqlQuery: string, values: any[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.control.query(sqlQuery, values, (err, result) => {
        if (err) {
          console.error('Erro ao executar a inserção SQL:', err);
          reject(err); // Rejeita a promessa em caso de erro
        } else {
          console.log('Inserção bem-sucedida no banco de dados');
          resolve(); // Resolve a promessa se a inserção for bem-sucedida
        }
      });
    });
  }

  public async update(sqlQuery: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.control.query(sqlQuery, (err, result) => {
        if (err) {
          console.error('Erro ao executar a atualização SQL:', err);
          reject(err); // Rejeita a promessa em caso de erro
        } else {
          console.log('Atualização bem-sucedida no banco de dados');
          resolve(); // Resolve a promessa se a atualização for bem-sucedida
        }
      });
    });
  } 
}