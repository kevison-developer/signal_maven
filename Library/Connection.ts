import * as mysql from 'mysql';

export class Connection {
  protected dbHost: string = '';
  protected dbName: string = '';
  protected dbUser: string = '';
  protected dbPasswd: string = '';

  public control: mysql.Connection;

  constructor(dbHost: string, dbName: string, dbUser: string, dbPasswd: string) {
    this.setHost(dbHost);
    this.setDbName(dbName);
    this.setDbUser(dbUser);
    this.setDbPasswd(dbPasswd);

    this.control = mysql.createConnection({
      host: this.getDbHost(),
      user: this.getDbUser(),
      password: this.getDbPasswd(),
      database: this.getDbName()
    });

    this.control.connect((err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
      }
      console.log('Conexão bem-sucedida ao banco de dados');
    });
  }

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

  protected getDbHost(): string {
    return this.dbHost;
  }
  protected getDbName(): string {
    return this.dbName;
  }
  protected getDbUser(): string {
    return this.dbUser;
  }
  protected getDbPasswd(): string {
    return this.dbPasswd;
  }

  protected setHost(dbHost: string): void {
    this.dbHost = dbHost;
  }
  protected setDbName(dbName: string): void {
    this.dbName = dbName;
  }
  protected setDbUser(dbUser: string): void {
    this.dbUser = dbUser;
  }
  protected setDbPasswd(dbPasswd: string): void {
    this.dbPasswd = dbPasswd;
  }
}

// Exemplo de uso
// const connection = new Connection('108.181.92.73', 'prole634_local', 'prole', 'F^A2#?4yi4ub');
// const control = new Connection('108.181.92.73', 'prole-unify', 'prole-main', 'F^A2#?4yi4ub');