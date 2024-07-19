import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import csvtojson from 'csvtojson';
import excelToJson from 'convert-excel-to-json';

const app = express();
const PORT = 3000;

interface Student {
  [key: string]: any;
}

let jsonArray: Student[];

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

    if (req.file.originalname.endsWith('.csv')) {
      jsonArray = await csvtojson().fromFile(filePath);
    } else if (req.file.originalname.endsWith('.xls') || req.file.originalname.endsWith('.xlsx')) {
      const result = excelToJson({
        sourceFile: filePath,
        header: { rows: 1 }  // Ignora a primeira linha de cabeçalho
      });

      const sheetName = Object.keys(result)[0];  // Pega o nome da primeira aba
      jsonArray = result[sheetName].map((row: any) => {
        return {
          name: row.A,
          email: row.B,
          phone: row.C,
          type: "message",
          status: 0
        };
      });
    } else {
      return res.status(400).send('Formato de arquivo não suportado.');
    }

    const filteredStudents = jsonArray.map(student => {
      const { name, email, phone, type, status } = student;
    
      const formattedPhone = phone.replace(/[^\d]/g, '');
    
      return { name, email, phone: formattedPhone, type, status };
    });

    const saveDatabaseUrl = 'http://localhost:3001/save_database';
    await fetch(saveDatabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(filteredStudents)
    });

    res.send(filteredStudents);
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).send('Erro ao processar o arquivo.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
