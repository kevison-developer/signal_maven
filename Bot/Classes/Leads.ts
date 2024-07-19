import { Connection } from '../Library/Connection';

export class Leads extends Connection {
  
  // Método para testar a conexão com o banco de dados
  public async testConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.control.connect((err) => {
        if (err) {
          console.error('Erro ao conectar ao banco de dados:', err);
          console.log(err);
          reject(err); // Rejeita a promessa em caso de erro
        } else {
          console.log('Conexão bem-sucedida com o banco de dados');
          this.control.end(); // Encerra a conexão
          resolve(); // Resolve a promessa se a conexão for bem-sucedida
        }
      });
    });
  }

  // Método para executar uma consulta SQL e retornar os resultados como um array de objetos simples
  public async query(sqlQuery: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.control.query(sqlQuery, (err, results) => {
        if (err) {
          reject(err);
        } else {
          // Verificar o tipo de retorno da consulta
          if (Array.isArray(results)) {
            // Se for um array, é uma consulta de seleção (SELECT)
            const simplifiedResults = results.map((row: any) => ({ ...row }));
            resolve(simplifiedResults);
          } else {
            // Caso contrário, não é uma consulta de seleção
            // Você pode optar por retornar algo diferente ou tratar de outra forma, dependendo da sua lógica de negócio
            reject(new Error('A consulta não retornou resultados'));
          }
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

  // Método para executar uma instrução SQL de inserção e retornar o último ID inserido
  public async insert_sheet(sqlQuery: string, values: any[]): Promise<number> {
    return new Promise((resolve, reject) => {
      this.control.query(sqlQuery, values, (err, result) => {
        if (err) {
          console.error('Erro ao executar a inserção SQL:', err);
          reject(err); // Rejeita a promessa em caso de erro
        } else {
          console.log('Inserção bem-sucedida no banco de dados');
          // Verifica se a propriedade insertId existe no objeto result
          if ('insertId' in result) {
            resolve(result.insertId); // Resolve a promessa com o ID do último registro inserido
          } else {
            reject(new Error('A propriedade insertId não foi encontrada no resultado da consulta.'));
          }
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