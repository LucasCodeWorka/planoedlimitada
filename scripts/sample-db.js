import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 10000
});

const allowedTables = new Set([
  'cache_dproduto',
  'dempresa_ativa',
  'ped_pedidoc',
  'ped_pedidoi',
  'prd_produto',
  'prd_produtoclas',
  'prd_classificacao',
  'prd_grupo',
  'prd_cor',
  'vr_vendas_qtd',
  'vr_prd_prdgrade'
]);

const table = process.argv[2];
if (!allowedTables.has(table)) {
  console.error(`Tabela nao permitida: ${table}`);
  process.exit(1);
}

try {
  await client.connect();

  const count = await client.query(`select count(*)::int as total from public.${table}`);
  const sample = await client.query(`select * from public.${table} limit 10`);

  console.log(JSON.stringify({ table, count: count.rows[0].total, sample: sample.rows }, null, 2));
} finally {
  await client.end().catch(() => {});
}
