import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  getClassificationTypes,
  getCompanies,
  getHealth,
  getSalesSummary
} from './dashboardRepository.js';

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT || 3001);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

app.use(cors({
  origin: process.env.CORS_ORIGIN || true
}));
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    const db = await getHealth();
    res.json({ ok: true, db });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/db/classification-types', async (_req, res) => {
  try {
    res.json(await getClassificationTypes());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/db/companies', async (_req, res) => {
  try {
    res.json(await getCompanies());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/db/sales', async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const limit = Math.min(Number(req.query.limit || 1000), 10000);

    res.json(await getSalesSummary({ startDate, endDate, limit }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/dashboard-data', (_req, res) => {
  const filePath = path.join(rootDir, 'dados_reais.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  data.meta = {
    ...(data.meta || {}),
    origem: 'arquivo-local',
    observacao: 'Endpoint mantido como contrato do frontend. Vendas usam vr_vendas_qtd, produtos usam vr_prd_prdgrade e classificacoes usam prd_produtoclas/prd_classificacao; o plano de edicao limitada ainda vem do arquivo local.'
  };

  res.json(data);
});

app.listen(port, () => {
  console.log(`API do dashboard em http://localhost:${port}`);
});
