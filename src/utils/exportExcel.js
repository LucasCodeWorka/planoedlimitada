import * as XLSX from 'xlsx';

/**
 * Exporta dados para Excel
 * @param {Array} data - Array de objetos com os dados
 * @param {string} filename - Nome do arquivo (sem extensão)
 * @param {string} sheetName - Nome da aba
 */
export const exportToExcel = (data, filename, sheetName = 'Dados') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Exporta tabela comparativa (Família x Lojas) para Excel
 */
export const exportComparativoLojas = (familias, lojas, filename = 'comparativo_lojas') => {
  const data = [];

  familias.forEach(fam => {
    const row = {
      'Família': fam.nome,
    };

    lojas.forEach((loja, idx) => {
      row[`${loja} 2025`] = fam.vendas2025[idx] || 0;
      row[`${loja} 2026`] = fam.plano2026[idx] || 0;
    });

    row['Total 2025'] = fam.vendas2025.reduce((a, b) => a + b, 0);
    row['Total 2026'] = fam.plano2026.reduce((a, b) => a + b, 0);
    row['Var %'] = row['Total 2025'] > 0
      ? ((row['Total 2026'] - row['Total 2025']) / row['Total 2025'] * 100).toFixed(1) + '%'
      : '-';

    data.push(row);
  });

  exportToExcel(data, filename, 'Comparativo');
};

/**
 * Exporta mapeamento de famílias para Excel
 */
export const exportMapeamentoFamilias = (familias, lojas, filename = 'mapeamento_familias') => {
  const data = [];

  familias.forEach(fam => {
    const row = {
      'Família Atual': fam.familiaAtual,
      'Família Anterior': fam.familiaAnterior,
    };

    lojas.forEach((loja, idx) => {
      row[`${loja} 2025`] = fam.vendas2025[idx] || 0;
      row[`${loja} 2026`] = fam.plano2026[idx] || 0;
    });

    row['Total 2025'] = fam.vendas2025.reduce((a, b) => a + b, 0);
    row['Total 2026'] = fam.plano2026.reduce((a, b) => a + b, 0);

    data.push(row);
  });

  exportToExcel(data, filename, 'Mapeamento');
};

/**
 * Exporta tabela de plano de edição limitada para Excel
 */
export const exportPlanoEdicaoLimitada = (dados, filename = 'plano_edicao_limitada') => {
  const data = dados.map(item => ({
    'Referência': item.ref || item.REF,
    'Cor': item.cor || item.COR,
    'Tamanho': item.tam || item.TAM,
    'Família': item.familia || item.FAMILIA,
    'Grupo': item.grupo || item.GRUPO,
    'Plano Original': item.planoOriginal || item.QTD_PROJETADA || 0,
    'Plano Final': item.plano || 0,
    'Regra Aplicada': item.regraAplicada || '-',
  }));

  exportToExcel(data, filename, 'Plano');
};

/**
 * Exporta dados de gráfico horizontal para Excel
 */
export const exportGraficoData = (dados, titulo, filename) => {
  const data = dados.map(item => ({
    [titulo.replace('Por ', '')]: item.nome,
    'Quantidade': item.valor,
  }));

  exportToExcel(data, filename, titulo);
};

/**
 * Exporta nível detalhado (SKU) do comparativo para Excel - para PCP
 * Usa a participação GERAL de cada loja (baseada no total de vendas 2025)
 * @param {Array} planoData - Dados do plano (planoEdicaoLimitadaData)
 * @param {Object} comparativoData - Dados do comparativo com participação por loja
 * @param {string} filename - Nome do arquivo
 */
export const exportComparativoDetalhado = (planoData, comparativoData, filename = 'plano_detalhado_pcp') => {
  const { lojas, familias } = comparativoData;

  // Lojas excluídas para famílias PLUS
  const LOJAS_EXCLUIDAS_TAM_MAIOR = ['DOM LUIS', 'NORTH JOQUEI', 'ECOMMERCE'];

  const ehFamiliaTamanhoMaior = (familia) => {
    const familiaUpper = String(familia).toUpperCase().trim();
    return familiaUpper.includes('PLUS');
  };

  const lojaExcluidaTamanhoMaior = (loja) => {
    const lojaUpper = String(loja).toUpperCase().trim();
    return LOJAS_EXCLUIDAS_TAM_MAIOR.some(excl => lojaUpper.includes(excl.toUpperCase()));
  };

  // Participação GERAL de cada loja baseada nos dados reais de venda 2025
  // Total = 21.690 (KPI Venda 2025)
  // 15 lojas separadas (sem consolidação)

  const lojasPCP = [
    'MARAPONGA', 'IGUATEMI', 'PORTO ALEGRE', 'BARRA', 'SALVADOR', 'RIO MAR RECIFE',
    'MORUMBI', 'PARANGABA', 'DOM LUIS', 'NORTH', 'NORTH JOQUEI', 'ECOMMERCE', 'TABOSA',
    'RIOMAR KENNEDY', 'INTIMATES'
  ];

  // Vendas 2025 por loja (Total = 21.690)
  const vendasPorLoja = {
    'MARAPONGA': 4909,
    'IGUATEMI': 2405,
    'PORTO ALEGRE': 2600,
    'BARRA': 1396,
    'SALVADOR': 1307,
    'RIO MAR RECIFE': 1233,
    'MORUMBI': 1141,
    'PARANGABA': 958,
    'DOM LUIS': 792,
    'NORTH': 820,
    'NORTH JOQUEI': 375,
    'ECOMMERCE': 227,
    'TABOSA': 308,
    'RIOMAR KENNEDY': 1009,
    'INTIMATES': 719
  };

  const totalGeral = Object.values(vendasPorLoja).reduce((s, v) => s + v, 0);
  const participacaoPorLoja = {};
  Object.keys(vendasPorLoja).forEach(loja => {
    participacaoPorLoja[loja] = vendasPorLoja[loja] / totalGeral;
  });

  // Filtrar apenas VERAO 27
  const skusVerao27 = planoData.filter(item => item.colecao === 'VERAO 27');

  const data = [];

  skusVerao27.forEach(sku => {
    const isTamMaior = ehFamiliaTamanhoMaior(sku.familia);

    const row = {
      'Família': sku.familia,
      'Referência': sku.ref,
      'Cor': sku.cor,
      'Tamanho': sku.tam,
      'Grupo': sku.grupo || '-',
      'Plano Total': sku.plano,
    };

    // Para PLUS, recalcular participação excluindo lojas proibidas
    let participacaoAjustada = { ...participacaoPorLoja };
    if (isTamMaior) {
      // Zerar lojas excluídas e recalcular proporção
      const vendasAjustadas = {};
      let totalAjustado = 0;
      Object.keys(vendasPorLoja).forEach(loja => {
        if (lojaExcluidaTamanhoMaior(loja)) {
          vendasAjustadas[loja] = 0;
        } else {
          vendasAjustadas[loja] = vendasPorLoja[loja];
          totalAjustado += vendasPorLoja[loja];
        }
      });
      Object.keys(vendasAjustadas).forEach(loja => {
        participacaoAjustada[loja] = totalAjustado > 0 ? vendasAjustadas[loja] / totalAjustado : 0;
      });
    }

    // Distribuir usando algoritmo "largest remainder" para garantir soma = total
    const planoTotal = sku.plano;
    const distribuicao = {};
    const restos = [];

    // Passo 1: Calcular floor e resto para cada loja
    lojasPCP.forEach(loja => {
      const lojaExcluida = isTamMaior && lojaExcluidaTamanhoMaior(loja);
      if (lojaExcluida) {
        distribuicao[loja] = 0;
      } else {
        const valorExato = planoTotal * participacaoAjustada[loja];
        const valorFloor = Math.floor(valorExato);
        const resto = valorExato - valorFloor;
        distribuicao[loja] = valorFloor;
        restos.push({ loja, resto });
      }
    });

    // Passo 2: Calcular diferença entre total e soma dos floors
    const somaFloors = Object.values(distribuicao).reduce((s, v) => s + v, 0);
    let falta = planoTotal - somaFloors;

    // Passo 3: Ordenar por maior resto e distribuir as unidades faltantes
    restos.sort((a, b) => b.resto - a.resto);
    for (let i = 0; i < falta && i < restos.length; i++) {
      distribuicao[restos[i].loja] += 1;
    }

    // Adicionar coluna para cada loja PCP
    lojasPCP.forEach(loja => {
      row[loja] = distribuicao[loja];
    });

    data.push(row);
  });

  // Ordenar por Família > Referência > Cor > Tamanho
  data.sort((a, b) => {
    if (a['Família'] !== b['Família']) return a['Família'].localeCompare(b['Família']);
    if (a['Referência'] !== b['Referência']) return a['Referência'].localeCompare(b['Referência']);
    if (a['Cor'] !== b['Cor']) return a['Cor'].localeCompare(b['Cor']);
    return a['Tamanho'].localeCompare(b['Tamanho']);
  });

  exportToExcel(data, filename, 'Plano PCP');
};
