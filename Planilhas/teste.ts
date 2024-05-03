import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import csvtojson from 'csvtojson';
import xlstojson from 'xls-to-json-lc';
import xlsxtojson from 'xlsx-to-json-lc';

const app = express();
const PORT = 3000;

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

const xlsToJsonAsync = promisify(xlstojson);
const xlsxToJsonAsync = promisify(xlsxtojson);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'teste.html'));
});

app.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).send('Nenhum arquivo enviado.');
    }

    const filePath = path.join(__dirname, 'uploads', req.file.filename);
    let jsonArray;

    if (req.file.originalname.endsWith('.csv')) {
      jsonArray = await csvtojson().fromFile(filePath);
    } else if (req.file.originalname.endsWith('.xls')) {
      const xlsJson = await xlsToJsonAsync({ input: filePath });
      jsonArray = xlsJson;
    } else if (req.file.originalname.endsWith('.xlsx')) {
      const xlsxJson = await xlsxToJsonAsync({ input: filePath });
      jsonArray = xlsxJson;
    } else {
      return res.status(400).send('Formato de arquivo não suportado.');
    }

    // Salvar o arquivo JSON na pasta uploads
    const jsonFilePath = path.join(__dirname, 'uploads', `${req.file.fieldname}-${Date.now()}.json`);
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2));

    // Aqui você pode inserir o código para salvar jsonArray no seu banco de dados

    res.send(jsonArray); // Ou envie uma resposta com o JSON transformado
  } catch (error) {
    console.error('Erro ao processar o arquivo:', error);
    res.status(500).send('Erro ao processar o arquivo.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
