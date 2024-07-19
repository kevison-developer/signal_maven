import * as mysql from 'mysql2';

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