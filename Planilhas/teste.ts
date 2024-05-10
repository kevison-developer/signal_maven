import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csvtojson from 'csvtojson';
import excelToJson from 'convert-excel-to-json';

const app = express();
const PORT = 3000;

// Tipagem para os objetos dentro do array jsonArray
interface Student {
  [key: string]: any;
}

// Usando tipos explícitos para jsonArray
let jsonArray: Student[]; // Definindo o tipo do jsonArray

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'teste.html'));
});

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    // let jsonArray:any;

    if (req.file.originalname.endsWith('.csv')) {
      jsonArray = await csvtojson().fromFile(filePath);
    } else if (req.file.originalname.endsWith('.xls') || req.file.originalname.endsWith('.xlsx')) {
      const result = excelToJson({
        sourceFile: filePath
      });
      // Assuming only one sheet in the Excel file
      jsonArray = result[Object.keys(result)[0]];
    } else {
      return res.status(400).send('Formato de arquivo não suportado.');
    }
    
    // Verificar e tratar dados para garantir coerência entre linhas e colunas versão 2.0


    // Captar dados específicos, como formato e tipo de disparo
    const filtered_students: { phone: string; name: string; email: string; type: string }[] = [];

    jsonArray.forEach(student => {
      const { telefone_01: phone, nome_do_aluno: name, email, segmento: type } = student;

      // Aqui a propriedade phone é formatada par excluir caracteres específicos
      const formatted_phone = phone.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");

      filtered_students.push({ phone: formatted_phone, name, email, type });
    });

    // Enviar os dados filtrados para outra rota usando fetch
    const saveDatabaseUrl = 'http://localhost:3000/save_database';
    await fetch(saveDatabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filtered_students)
    });

    // Aqui você pode inserir o código para salvar o arquivo JSON no seu banco de dados
    res.send(filtered_students);
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).send('Erro ao processar o arquivo.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
