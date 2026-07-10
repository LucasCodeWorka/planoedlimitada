// Dados reais do projeto Verão 26 e Verão 27
// Gerado automaticamente pelo script gerar_dados_dashboard.py

import dadosReais from './dados_reais.json';

export const dashboardData = dadosReais;

// Exportar dados reais
export const filterOptions = dadosReais.filterOptions;

// TODO: PENDÊNCIA - Adicionar dados por EMPRESA quando disponível
// Os filtros por empresa já estão implementados, falta apenas:
// 1. Incluir coluna EMPRESA nos CSVs de origem
// 2. Processar no script gerar_dados_dashboard.py
// 3. Atualizar este arquivo com os dados reais por empresa

export const kpiData = dadosReais.kpiData;
export const grupoData = dadosReais.grupoData;
export const grupoData2025 = dadosReais.grupoData2025;
export const familiaData = dadosReais.familiaData;
export const familiaData2025 = dadosReais.familiaData2025;
export const linhaData = dadosReais.linhaData;
export const linhaData2025 = dadosReais.linhaData2025;
export const subgrupoData = dadosReais.subgrupoData;
export const subgrupoData2025 = dadosReais.subgrupoData2025;
export const refData = dadosReais.refData;
export const refData2025 = dadosReais.refData2025;
export const mesProducaoData = dadosReais.mesProducaoData;
export const mesVenda2025Data = dadosReais.mesVenda2025Data;
export const planoEdicaoLimitadaData = dadosReais.planoEdicaoLimitadaData;
export const comparativoLojasData = dadosReais.comparativoLojasData;
export const mapeamentoFamiliasData = dadosReais.mapeamentoFamiliasData;
