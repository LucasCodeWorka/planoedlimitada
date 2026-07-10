import { query } from './db.js';

export const CLASSIFICATION_TYPES = {
  marca: 20,
  colecao: 21,
  classificacao: 23,
  familia: 24,
  grupo: 25,
  subgrupo: 26,
  status: 27,
  mixProducao: 29,
  continuidade: 802
};

export async function getHealth() {
  const result = await query('select now() as now');
  return result.rows[0];
}

export async function getCompanies() {
  const result = await query(`
    select idempresa::text as idempresa,
           empresa,
           suplojas,
           area,
           cidade,
           estado
    from public."dEMPRESA"
    order by empresa
  `);

  return result.rows;
}

export async function getClassificationTypes() {
  const result = await query(`
    select cd_tipoclas::int as tipo,
           count(*)::int as total,
           array_agg(ds_classificacao order by ds_classificacao) filter (where rn <= 10) as exemplos
    from (
      select cd_tipoclas, ds_classificacao,
             row_number() over (partition by cd_tipoclas order by ds_classificacao) as rn
      from public.prd_classificacao
    ) x
    group by cd_tipoclas
    order by cd_tipoclas
  `);

  return result.rows;
}

export async function getSalesSummary({ startDate, endDate, limit = 1000 } = {}) {
  if (!startDate || !endDate) {
    throw new Error('Informe startDate e endDate no formato YYYY-MM-DD.');
  }

  const result = await query(`
    with classificacoes as (
      select pc.cd_produto,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.marca}) as idmarca,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.marca}) as marca,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.colecao}) as idcolecao,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.colecao}) as colecao,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.classificacao}) as idclassificacao,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.classificacao}) as classificacao,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.familia}) as idfamilia,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.familia}) as familia,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.grupo}) as idgrupo,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.grupo}) as grupo,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.subgrupo}) as cd_subgrupo,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.subgrupo}) as subgrupo,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.status}) as idstatus,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.status}) as status,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.mixProducao}) as idmixproducao,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.mixProducao}) as mixproducao,
             max(trim(pc.cd_classificacao)) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.continuidade}) as cd_continuidade,
             max(c.ds_classificacao) filter (where pc.cd_tipoclas = ${CLASSIFICATION_TYPES.continuidade}) as continuidade
      from public.prd_produtoclas pc
      join public.prd_classificacao c
        on c.cd_tipoclas = pc.cd_tipoclas
       and trim(c.cd_classificacao) = trim(pc.cd_classificacao)
      where pc.cd_tipoclas in (
        ${CLASSIFICATION_TYPES.marca},
        ${CLASSIFICATION_TYPES.colecao},
        ${CLASSIFICATION_TYPES.classificacao},
        ${CLASSIFICATION_TYPES.familia},
        ${CLASSIFICATION_TYPES.grupo},
        ${CLASSIFICATION_TYPES.subgrupo},
        ${CLASSIFICATION_TYPES.status},
        ${CLASSIFICATION_TYPES.mixProducao},
        ${CLASSIFICATION_TYPES.continuidade}
      )
      group by pc.cd_produto
    )
    select v.idempresa::text as idempresa,
           e.empresa,
           v.idproduto::text as idproduto,
           cl.idmixproducao,
           cl.mixproducao,
           cl.idmarca,
           cl.marca,
           cl.idclassificacao,
           cl.classificacao,
           cl.idcolecao,
           cl.colecao,
           cl.idfamilia,
           cl.familia,
           cl.idgrupo,
           cl.grupo,
           cl.cd_subgrupo,
           cl.subgrupo,
           cl.idstatus,
           cl.status,
           cl.cd_continuidade,
           cl.continuidade,
           f_dic_prd_nivel(v.idproduto, 'CD'::bpchar) as referencia,
           g.nm_produto as produto,
           trim(g.cd_cor) as idcor,
           g.ds_cor as cor,
           g.cd_tamanho::text as idtamanho,
           g.ds_tamanho as tamanho,
           sum(v.qt_liquida)::float as venda
    from public.vr_vendas_qtd v
    left join public."dEMPRESA" e on e.idempresa = v.idempresa
    left join public.vr_prd_prdgrade g on g.cd_produto = v.idproduto
    left join classificacoes cl on cl.cd_produto = v.idproduto
    where v.data >= $1::date
      and v.data < ($2::date + interval '1 day')
      and v.idempresa <> 1
    group by v.idempresa, e.empresa, v.idproduto, f_dic_prd_nivel(v.idproduto, 'CD'::bpchar),
             cl.idmixproducao, cl.mixproducao,
             cl.idmarca, cl.marca, cl.idclassificacao, cl.classificacao, cl.idcolecao,
             cl.colecao, cl.idfamilia, cl.familia, cl.idgrupo, cl.grupo, cl.cd_subgrupo,
             cl.subgrupo, cl.idstatus, cl.status, cl.cd_continuidade, cl.continuidade,
             g.nm_produto, g.cd_cor, g.ds_cor, g.cd_tamanho, g.ds_tamanho
    order by venda desc
    limit $3
  `, [startDate, endDate, limit]);

  return result.rows;
}
