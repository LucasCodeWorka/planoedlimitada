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

try {
  await client.connect();

  const names = process.argv.slice(2);

  if (names.length > 0) {
    const columns = await client.query(`
      select table_schema, table_name, column_name, data_type
      from information_schema.columns
      where table_schema = 'public'
        and table_name = any($1)
      order by table_schema, table_name, ordinal_position
    `, [names]);

    console.log(JSON.stringify(columns.rows, null, 2));
    process.exit(0);
  }

  const tables = await client.query(`
    select table_schema, table_name
    from information_schema.tables
    where table_type = 'BASE TABLE'
      and table_schema not in ('pg_catalog', 'information_schema')
      and (
        table_name ilike '%produto%'
        or table_name ilike '%dproduto%'
        or table_name ilike '%pedido%'
        or table_name ilike '%projec%'
        or table_name ilike '%pcp%'
        or table_name ilike '%venda%'
        or table_name ilike '%empresa%'
        or table_name ilike '%saldo%'
        or table_name ilike '%class%'
        or table_name ilike '%cor%'
        or table_name ilike '%grupo%'
      )
    order by table_schema, table_name
  `);

  console.log(JSON.stringify(tables.rows, null, 2));
} finally {
  await client.end().catch(() => {});
}
