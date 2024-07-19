import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { Leads } from './Classes/Leads';
import { Message } from './Classes/Message';

const app = express();

// Middleware para fazer o parsing do corpo da requisição como JSON
app.use(bodyParser.json());

// Endpoint para lidar com requisições POST
app.post('/save_database', async (req: Request, res: Response) => {
  try {
    const data = req.body; // Os dados da requisição POST estão no corpo da requisição
    await uniq_sheet(data); // Chama a função engine() para lidar com os dados recebidos
    res.status(200).send('Dados inseridos com sucesso!');
  } catch (error) {
    // console.error('Erro ao testar a conexão com o banco de dados:', error);
    // console.log(error); // Adicione esta linha para imprimir o objeto de erro completo

    if (error instanceof Error) {
      res.status(500).send('Erro ao testar a conexão com o banco de dados: ' + error.message);
    } else {
      res.status(500).send('Erro ao testar a conexão com o banco de dados: ' + String(error));
    }
  }
});

// Endpoint para testar a conexão com o banco de dados
app.get('/test_database_connection', async (req: Request, res: Response) => {
  try {
    // Realizar conexão com banco de dados
    // const control = new Leads('108.181.92.73', 'signal_maven', 'maven', 'S1gNal@Mav&n');
    const control = new Leads("localhost", "signal_maven", "root", "1234");

    // Verificar a conexão
    await control.testConnection();

    res.status(200).send('Conexão com o banco de dados bem-sucedida!');
  } catch (error) {
    console.error('Erro ao testar a conexão com o banco de dados:', error);
    res.status(500).send('Erro ao testar a conexão com o banco de dados');
  }
});

// Inicia o servidor na porta desejada
const PORT = 3001; // Você pode ajustar a porta conforme necessário
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});

async function uniq_sheet(data: any) {
  try {
    // Realizar conexão com banco de dados
    // const control = new Leads('108.181.92.73', 'signal_maven', 'maven', 'S1gNal@Mav&n');
    const control = new Leads("localhost", "signal_maven", "root", "1234");

    // Inserir uma nova active_sheets
    const sheet_sql = `
      INSERT INTO active_sheets (sheet_title, status, type) 
      VALUES (?, ?, ?)
    `;
    const sheet_values = ["New Sheet Title", 1, "message"];

    let sheet_id: number;
    let sheet_engine: number;
    try {
      sheet_id = await control.insert_sheet(sheet_sql, sheet_values);
      console.log(`Nova active_sheet inserida com ID: ${sheet_id}`);
      sheet_engine = sheet_id
    } catch (error) {
      console.error("Erro ao inserir nova active_sheet:", error);
      return;  // Interrompe a execução caso a inserção falhe
    }

    // Iterar sobre os dados e inserir no banco de dados
    for (const row of data) {
      const sql = `
        INSERT INTO engine 
        (phone, name, email, type, status, sheet, date, changed) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [row.phone, row.name, row.email, row.type, 0, sheet_engine, new Date(), new Date()];

      try {
        await control.insert(sql, values);
        console.log(`Dados para ${row.name} inseridos com sucesso!`);
      } catch (error) {
        console.error(`Erro ao inserir dados para ${row.name}:`, error);
      }
    }
  } catch(error) {
    console.error(error);
  }
}