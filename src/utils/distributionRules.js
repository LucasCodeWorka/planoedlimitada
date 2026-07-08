/**
 * REGRAS DE DISTRIBUIÇÃO DO PLANO
 * ================================
 * Módulo com todas as regras de negócio para distribuição de peças
 */

// =============================================================================
// CONSTANTES
// =============================================================================

// Lojas excluídas de certas regras
export const LOJAS_EXCLUIDAS = {
  TAMANHOS_MAIORES: ['JOQUEI', 'DOM LUIS', 'ECOMMERCE', 'NORTH JOQUEI'],
  VENDA_ZERO: ['JOQUEI', 'NORTH JOQUEI']
};

// Tamanhos maiores por grupo
export const TAMANHOS_MAIORES = {
  SUTIA: ['48', '50'],
  CALCA: ['GG', 'XG', 'EG']
};

// Tamanhos permitidos por família/grupo
export const REGRAS_FAMILIA = {
  'LOVE APPEAL': {
    SUTIA: {
      tamanhos: ['42', '44'],
      gradeMinima: 2
    },
    CALCA: {
      tamanhos: ['M', 'G'],
      gradeMinima: 2
    }
  }
};

// Famílias contínuas (comparam apenas consigo mesmas)
export const FAMILIAS_CONTINUAS = [
  'LOVE APPEAL',
  'NOIVAS',
  'KISS ME',
  'CETIM',
  'LACE',
  'CONTROL',
  'VISCOW'
];

// Famílias de edição limitada (LUXE e FASHION)
export const FAMILIAS_EDICAO_LIMITADA = [
  'LUXE',
  'FASHION'
];

// Cores permanentes (não saem de linha)
export const CORES_PERMANENTES = [
  'PRETO',
  'BRANCO',
  'NUDE',
  'CHOCOLATE',
  'MARINHO'
];

// Configuração de envio MARAPONGA
export const ENVIO_MARAPONGA = {
  percentualJunho: 0.5,
  percentualAgosto: 0.5,
  meses: ['JUNHO', 'AGOSTO']
};

// =============================================================================
// REGRA 1: LOVE APPEAL
// =============================================================================

/**
 * Aplica a regra específica para a família LOVE APPEAL
 * - Sutiãs: apenas tamanhos 42 ou 44
 * - Calcinhas: apenas tamanhos M ou G
 * - Grade mínima: 02 peças
 *
 * @param {Object} sku - O SKU a ser validado
 * @param {number} quantidade - Quantidade calculada
 * @returns {Object} { valido: boolean, quantidade: number, motivo: string }
 */
export function aplicarRegraLoveAppeal(sku, quantidade) {
  if (sku.familia !== 'LOVE APPEAL') {
    return { valido: true, quantidade, motivo: null };
  }

  const grupo = sku.grupo?.toUpperCase() || '';
  const tamanho = sku.tam?.toUpperCase() || '';
  const regra = REGRAS_FAMILIA['LOVE APPEAL'];

  // Verificar se é sutiã
  if (grupo.includes('SUTIA') || grupo.includes('SUTIÃ')) {
    const tamanhosPermitidos = regra.SUTIA.tamanhos;

    if (!tamanhosPermitidos.includes(tamanho)) {
      return {
        valido: false,
        quantidade: 0,
        motivo: `LOVE APPEAL: Sutiã tamanho ${tamanho} não permitido (apenas ${tamanhosPermitidos.join(', ')})`
      };
    }

    // Aplicar grade mínima
    if (quantidade > 0 && quantidade < regra.SUTIA.gradeMinima) {
      return {
        valido: true,
        quantidade: regra.SUTIA.gradeMinima,
        motivo: `LOVE APPEAL: Ajustado para grade mínima de ${regra.SUTIA.gradeMinima} peças`
      };
    }
  }

  // Verificar se é calcinha
  if (grupo.includes('CALCA') || grupo.includes('CALCINHA')) {
    const tamanhosPermitidos = regra.CALCA.tamanhos;

    if (!tamanhosPermitidos.includes(tamanho)) {
      return {
        valido: false,
        quantidade: 0,
        motivo: `LOVE APPEAL: Calcinha tamanho ${tamanho} não permitida (apenas ${tamanhosPermitidos.join(', ')})`
      };
    }

    // Aplicar grade mínima
    if (quantidade > 0 && quantidade < regra.CALCA.gradeMinima) {
      return {
        valido: true,
        quantidade: regra.CALCA.gradeMinima,
        motivo: `LOVE APPEAL: Ajustado para grade mínima de ${regra.CALCA.gradeMinima} peças`
      };
    }
  }

  return { valido: true, quantidade, motivo: null };
}

// =============================================================================
// REGRA 2: EDIÇÃO LIMITADA - VENDA ZERO
// =============================================================================

/**
 * Encontra os 2 tamanhos mais vendidos por grupo (excluindo JOQUEI)
 *
 * @param {Array} dadosVendas - Array com dados de vendas
 * @param {string} grupo - Grupo do produto (ex: 'CALCA', 'SUTIA')
 * @returns {Array} Os 2 tamanhos mais vendidos
 */
export function encontrarTamanhosMaisVendidos(dadosVendas, grupo) {
  // Filtrar vendas do grupo, excluindo lojas JOQUEI
  const vendasFiltradas = dadosVendas.filter(v =>
    v.grupo?.toUpperCase() === grupo.toUpperCase() &&
    !LOJAS_EXCLUIDAS.VENDA_ZERO.some(loja =>
      v.loja?.toUpperCase().includes(loja.toUpperCase())
    )
  );

  // Agrupar vendas por tamanho
  const vendasPorTamanho = {};
  vendasFiltradas.forEach(v => {
    const tam = v.tam?.toUpperCase() || '';
    if (!vendasPorTamanho[tam]) {
      vendasPorTamanho[tam] = 0;
    }
    vendasPorTamanho[tam] += v.quantidade || 0;
  });

  // Ordenar por quantidade e pegar os 2 maiores
  const tamanhosOrdenados = Object.entries(vendasPorTamanho)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([tam]) => tam);

  return tamanhosOrdenados;
}

/**
 * Aplica a regra de venda zero para edição limitada
 * - Quando venda = 0, arredonda para 1 apenas nos 2 tamanhos mais vendidos
 * - Exclui loja JOQUEI do cálculo
 *
 * @param {Object} sku - O SKU a ser validado
 * @param {number} vendaAnterior - Venda do ano anterior
 * @param {Array} tamanhosMaisVendidos - Os 2 tamanhos mais vendidos do grupo
 * @returns {Object} { quantidade: number, motivo: string }
 */
export function aplicarRegraVendaZero(sku, vendaAnterior, tamanhosMaisVendidos) {
  const tamanho = sku.tam?.toUpperCase() || '';

  // Se teve venda, não aplica esta regra
  if (vendaAnterior > 0) {
    return { quantidade: vendaAnterior, motivo: null };
  }

  // Se venda = 0, verificar se está nos 2 tamanhos mais vendidos
  if (tamanhosMaisVendidos.includes(tamanho)) {
    return {
      quantidade: 1,
      motivo: `Venda zero: Arredondado para 1 (tamanho ${tamanho} está entre os 2 mais vendidos)`
    };
  }

  // Tamanho não está entre os mais vendidos, mantém zero
  return {
    quantidade: 0,
    motivo: `Venda zero: Mantido em 0 (tamanho ${tamanho} não está entre os 2 mais vendidos)`
  };
}

// =============================================================================
// REGRA 7: COMPARAÇÃO VENDAS POR GRUPO/ANO
// =============================================================================

/**
 * Compara vendas do ano anterior por grupo
 * - Calcula percentual de participação de cada grupo
 * - Distribui o plano proporcionalmente
 *
 * @param {Array} vendasAnoAnterior - Vendas do ano anterior por grupo
 * @param {string} grupo - Grupo do produto
 * @param {number} planoTotal - Plano total a ser distribuído
 * @returns {Object} { quantidade: number, percentual: number, motivo: string }
 */
export function calcularComparacaoVendasGrupo(vendasAnoAnterior, grupo, planoTotal) {
  const grupoUpper = grupo?.toUpperCase() || '';

  // Calcular total de vendas
  const totalVendas = vendasAnoAnterior.reduce((sum, v) => sum + (v.quantidade || 0), 0);

  if (totalVendas === 0) {
    return {
      quantidade: 0,
      percentual: 0,
      motivo: 'Comparação Vendas: Sem vendas no ano anterior'
    };
  }

  // Encontrar vendas do grupo específico
  const vendasGrupo = vendasAnoAnterior
    .filter(v => v.grupo?.toUpperCase() === grupoUpper)
    .reduce((sum, v) => sum + (v.quantidade || 0), 0);

  // Calcular percentual de participação
  const percentual = vendasGrupo / totalVendas;

  // Distribuir plano proporcionalmente
  const quantidade = Math.round(planoTotal * percentual);

  return {
    quantidade,
    percentual: (percentual * 100).toFixed(1),
    motivo: `Comparação Vendas: ${(percentual * 100).toFixed(1)}% do total (${vendasGrupo} de ${totalVendas} peças)`
  };
}

// =============================================================================
// REGRA 8: ENVIO MARAPONGA 50%/50%
// =============================================================================

/**
 * Aplica a regra de envio para MARAPONGA
 * - 50% em junho
 * - 50% em agosto
 *
 * @param {string} loja - Nome da loja
 * @param {number} quantidade - Quantidade total
 * @param {string} mes - Mês de produção
 * @returns {Object} { quantidade: number, motivo: string }
 */
export function aplicarRegraEnvioMaraponga(loja, quantidade, mes) {
  const isMaraponga = loja?.toUpperCase().includes('MARAPONGA');

  if (!isMaraponga) {
    return { quantidade, motivo: null };
  }

  const mesUpper = mes?.toUpperCase() || '';

  if (mesUpper === 'JUNHO') {
    const qtdJunho = Math.round(quantidade * ENVIO_MARAPONGA.percentualJunho);
    return {
      quantidade: qtdJunho,
      motivo: `Envio MARAPONGA: 50% em junho (${qtdJunho} de ${quantidade} peças)`
    };
  }

  if (mesUpper === 'AGOSTO') {
    const qtdAgosto = Math.round(quantidade * ENVIO_MARAPONGA.percentualAgosto);
    return {
      quantidade: qtdAgosto,
      motivo: `Envio MARAPONGA: 50% em agosto (${qtdAgosto} de ${quantidade} peças)`
    };
  }

  // Outros meses não recebem envio para MARAPONGA
  return {
    quantidade: 0,
    motivo: `Envio MARAPONGA: Apenas junho e agosto (mês atual: ${mes})`
  };
}

/**
 * Calcula a distribuição mensal para MARAPONGA
 *
 * @param {number} quantidadeTotal - Quantidade total a distribuir
 * @returns {Object} { junho: number, agosto: number }
 */
export function calcularDistribuicaoMaraponga(quantidadeTotal) {
  const junho = Math.round(quantidadeTotal * ENVIO_MARAPONGA.percentualJunho);
  const agosto = quantidadeTotal - junho; // Resto vai para agosto para evitar arredondamento

  return { junho, agosto };
}

// =============================================================================
// REGRA 3: EDIÇÃO PERMANENTE
// =============================================================================

/**
 * Aplica a regra para edição permanente
 * - Mínimo 01 peça por SKU
 * - Apenas para cores permanentes (PRETO, BRANCO, NUDE, CHOCOLATE, MARINHO)
 *
 * @param {Object} sku - O SKU a ser validado
 * @param {number} quantidade - Quantidade calculada
 * @returns {Object} { valido: boolean, quantidade: number, motivo: string }
 */
export function aplicarRegraEdicaoPermanente(sku, quantidade) {
  const cor = sku.cor?.toUpperCase() || '';

  // Verificar se é cor permanente
  const isCorPermanente = CORES_PERMANENTES.some(
    c => cor.includes(c.toUpperCase())
  );

  if (!isCorPermanente) {
    return { valido: true, quantidade, motivo: null };
  }

  // Cor permanente: mínimo 01 peça
  if (quantidade < 1 && quantidade > 0) {
    return {
      valido: true,
      quantidade: 1,
      motivo: `Edição Permanente: Ajustado para mínimo 1 peça (cor ${cor})`
    };
  }

  // Se quantidade é 0, garantir mínimo 1 para cores permanentes
  if (quantidade === 0) {
    return {
      valido: true,
      quantidade: 1,
      motivo: `Edição Permanente: Mínimo 1 peça obrigatório (cor permanente ${cor})`
    };
  }

  return { valido: true, quantidade, motivo: null };
}

// =============================================================================
// REGRA 4: TAMANHOS MAIORES - EDIÇÃO LIMITADA
// =============================================================================

/**
 * Aplica a regra de tamanhos maiores para edição limitada
 * - Exclui lojas: JOQUEI, DOM LUIS, ECOMMERCE, NORTH JOQUEI
 * - Tamanhos maiores: Sutiã 48/50, Calcinha GG/XG/EG
 *
 * @param {Object} sku - O SKU a ser validado
 * @param {string} loja - Nome da loja
 * @param {number} quantidade - Quantidade calculada
 * @returns {Object} { valido: boolean, quantidade: number, motivo: string }
 */
export function aplicarRegraTamanhosMaioresEdicaoLimitada(sku, loja, quantidade) {
  const tamanho = sku.tam?.toUpperCase() || '';
  const grupo = sku.grupo?.toUpperCase() || '';
  const familia = sku.familia?.toUpperCase() || '';

  // Verificar se é família de edição limitada
  const isEdicaoLimitada = FAMILIAS_EDICAO_LIMITADA.some(
    f => familia.includes(f.toUpperCase())
  );

  if (!isEdicaoLimitada) {
    return { valido: true, quantidade, motivo: null };
  }

  // Verificar se é tamanho maior
  const isTamanhoMaiorSutia = (grupo.includes('SUTIA') || grupo.includes('SUTIÃ')) &&
    TAMANHOS_MAIORES.SUTIA.includes(tamanho);
  const isTamanhoMaiorCalca = (grupo.includes('CALCA') || grupo.includes('CALCINHA')) &&
    TAMANHOS_MAIORES.CALCA.includes(tamanho);

  if (!isTamanhoMaiorSutia && !isTamanhoMaiorCalca) {
    return { valido: true, quantidade, motivo: null };
  }

  // Verificar se loja está excluída
  const lojaExcluida = LOJAS_EXCLUIDAS.TAMANHOS_MAIORES.some(
    l => loja?.toUpperCase().includes(l.toUpperCase())
  );

  if (lojaExcluida) {
    return {
      valido: false,
      quantidade: 0,
      motivo: `Tamanhos Maiores: ${loja} não recebe tamanho ${tamanho} em edição limitada`
    };
  }

  return { valido: true, quantidade, motivo: null };
}

// =============================================================================
// REGRA 5: TAMANHOS MAIORES - PERMANENTE (APENAS MARAPONGA)
// =============================================================================

/**
 * Aplica a regra de tamanhos maiores para permanente
 * - Apenas MARAPONGA recebe tamanhos maiores em coleção permanente
 *
 * @param {Object} sku - O SKU a ser validado
 * @param {string} loja - Nome da loja
 * @param {number} quantidade - Quantidade calculada
 * @returns {Object} { valido: boolean, quantidade: number, motivo: string }
 */
export function aplicarRegraTamanhosMaioresPermanente(sku, loja, quantidade) {
  const tamanho = sku.tam?.toUpperCase() || '';
  const grupo = sku.grupo?.toUpperCase() || '';
  const familia = sku.familia?.toUpperCase() || '';

  // Verificar se NÃO é família de edição limitada (é permanente)
  const isEdicaoLimitada = FAMILIAS_EDICAO_LIMITADA.some(
    f => familia.includes(f.toUpperCase())
  );

  if (isEdicaoLimitada) {
    return { valido: true, quantidade, motivo: null };
  }

  // Verificar se é tamanho maior
  const isTamanhoMaiorSutia = (grupo.includes('SUTIA') || grupo.includes('SUTIÃ')) &&
    TAMANHOS_MAIORES.SUTIA.includes(tamanho);
  const isTamanhoMaiorCalca = (grupo.includes('CALCA') || grupo.includes('CALCINHA')) &&
    TAMANHOS_MAIORES.CALCA.includes(tamanho);

  if (!isTamanhoMaiorSutia && !isTamanhoMaiorCalca) {
    return { valido: true, quantidade, motivo: null };
  }

  // Apenas MARAPONGA recebe tamanhos maiores em permanente
  const isMaraponga = loja?.toUpperCase().includes('MARAPONGA');

  if (!isMaraponga) {
    return {
      valido: false,
      quantidade: 0,
      motivo: `Tamanhos Maiores Permanente: Apenas MARAPONGA recebe tamanho ${tamanho}`
    };
  }

  return { valido: true, quantidade, motivo: null };
}

// =============================================================================
// REGRA 6: ARREDONDAMENTO
// =============================================================================

/**
 * Aplica as regras de arredondamento
 * - Abaixo de 1 → 1
 * - De 1,00 a 1,49 → 1
 * - De 1,50 a 1,99 → 2
 *
 * @param {number} valor - Valor calculado
 * @returns {number} Valor arredondado
 */
export function aplicarArredondamento(valor) {
  if (valor <= 0) return 0;
  if (valor < 1) return 1;
  if (valor < 1.5) return 1;
  if (valor < 2) return 2;
  return Math.round(valor);
}

// =============================================================================
// FUNÇÃO PRINCIPAL: APLICAR TODAS AS REGRAS
// =============================================================================

/**
 * Aplica todas as regras de distribuição a um SKU
 *
 * @param {Object} sku - O SKU com dados do produto
 * @param {Object} contexto - Contexto adicional (vendas, loja, etc)
 * @returns {Object} { quantidade: number, regrasAplicadas: Array, bloqueado: boolean }
 */
export function aplicarRegrasDistribuicao(sku, contexto = {}) {
  const {
    vendaAnterior = 0,
    tamanhosMaisVendidos = [],
    loja = '',
    mes = ''
  } = contexto;

  let quantidade = vendaAnterior;
  const regrasAplicadas = [];
  let bloqueado = false;

  // REGRA 1: LOVE APPEAL
  const resultadoLoveAppeal = aplicarRegraLoveAppeal(sku, quantidade);
  if (!resultadoLoveAppeal.valido) {
    return {
      quantidade: 0,
      bloqueado: true,
      regrasAplicadas: [{
        regra: 'LOVE APPEAL',
        motivo: resultadoLoveAppeal.motivo
      }]
    };
  }
  if (resultadoLoveAppeal.motivo) {
    quantidade = resultadoLoveAppeal.quantidade;
    regrasAplicadas.push({
      regra: 'LOVE APPEAL',
      motivo: resultadoLoveAppeal.motivo
    });
  }

  // REGRA 2: Venda Zero (apenas para edição limitada)
  if (vendaAnterior === 0 && tamanhosMaisVendidos.length > 0) {
    const resultadoVendaZero = aplicarRegraVendaZero(sku, vendaAnterior, tamanhosMaisVendidos);
    quantidade = resultadoVendaZero.quantidade;
    if (resultadoVendaZero.motivo) {
      regrasAplicadas.push({
        regra: 'VENDA ZERO',
        motivo: resultadoVendaZero.motivo
      });
    }
  }

  // REGRA 3: Edição Permanente (cores permanentes)
  const resultadoPermanente = aplicarRegraEdicaoPermanente(sku, quantidade);
  if (resultadoPermanente.motivo) {
    quantidade = resultadoPermanente.quantidade;
    regrasAplicadas.push({
      regra: 'EDIÇÃO PERMANENTE',
      motivo: resultadoPermanente.motivo
    });
  }

  // REGRA 4: Tamanhos Maiores - Edição Limitada
  const resultadoTamMaioresLimitada = aplicarRegraTamanhosMaioresEdicaoLimitada(sku, loja, quantidade);
  if (!resultadoTamMaioresLimitada.valido) {
    return {
      quantidade: 0,
      bloqueado: true,
      regrasAplicadas: [{
        regra: 'TAMANHOS MAIORES - ED. LIMITADA',
        motivo: resultadoTamMaioresLimitada.motivo
      }]
    };
  }

  // REGRA 5: Tamanhos Maiores - Permanente (apenas MARAPONGA)
  const resultadoTamMaioresPermanente = aplicarRegraTamanhosMaioresPermanente(sku, loja, quantidade);
  if (!resultadoTamMaioresPermanente.valido) {
    return {
      quantidade: 0,
      bloqueado: true,
      regrasAplicadas: [{
        regra: 'TAMANHOS MAIORES - PERMANENTE',
        motivo: resultadoTamMaioresPermanente.motivo
      }]
    };
  }

  // REGRA 8: Envio MARAPONGA (se loja for MARAPONGA e mês informado)
  if (loja && mes) {
    const resultadoMaraponga = aplicarRegraEnvioMaraponga(loja, quantidade, mes);
    if (resultadoMaraponga.motivo) {
      quantidade = resultadoMaraponga.quantidade;
      regrasAplicadas.push({
        regra: 'ENVIO MARAPONGA',
        motivo: resultadoMaraponga.motivo
      });
    }
  }

  // REGRA 6: Arredondamento final
  const quantidadeFinal = aplicarArredondamento(quantidade);
  if (quantidadeFinal !== quantidade) {
    regrasAplicadas.push({
      regra: 'ARREDONDAMENTO',
      motivo: `Arredondado de ${quantidade} para ${quantidadeFinal}`
    });
  }

  return {
    quantidade: quantidadeFinal,
    bloqueado,
    regrasAplicadas
  };
}

// =============================================================================
// UTILITÁRIOS
// =============================================================================

/**
 * Verifica se uma loja está excluída para tamanhos maiores
 */
export function isLojaExcluidaTamanhosMaiores(loja) {
  return LOJAS_EXCLUIDAS.TAMANHOS_MAIORES.some(
    l => loja?.toUpperCase().includes(l.toUpperCase())
  );
}

/**
 * Verifica se um tamanho é considerado "maior"
 */
export function isTamanhoMaior(tamanho, grupo) {
  const tam = tamanho?.toUpperCase() || '';
  const grp = grupo?.toUpperCase() || '';

  if (grp.includes('SUTIA') || grp.includes('SUTIÃ')) {
    return TAMANHOS_MAIORES.SUTIA.includes(tam);
  }
  if (grp.includes('CALCA') || grp.includes('CALCINHA')) {
    return TAMANHOS_MAIORES.CALCA.includes(tam);
  }
  return false;
}

/**
 * Verifica se uma família é contínua
 */
export function isFamiliaContinua(familia) {
  return FAMILIAS_CONTINUAS.some(
    f => familia?.toUpperCase().includes(f.toUpperCase())
  );
}

export default {
  // Regra 1: LOVE APPEAL
  aplicarRegraLoveAppeal,
  // Regra 2: Venda Zero
  aplicarRegraVendaZero,
  encontrarTamanhosMaisVendidos,
  // Regra 3: Edição Permanente
  aplicarRegraEdicaoPermanente,
  // Regra 4: Tamanhos Maiores - Edição Limitada
  aplicarRegraTamanhosMaioresEdicaoLimitada,
  // Regra 5: Tamanhos Maiores - Permanente
  aplicarRegraTamanhosMaioresPermanente,
  // Regra 6: Arredondamento
  aplicarArredondamento,
  // Regra 7: Comparação Vendas
  calcularComparacaoVendasGrupo,
  // Regra 8: Envio MARAPONGA
  aplicarRegraEnvioMaraponga,
  calcularDistribuicaoMaraponga,
  // Função principal
  aplicarRegrasDistribuicao,
  // Utilitários
  isLojaExcluidaTamanhosMaiores,
  isTamanhoMaior,
  isFamiliaContinua,
  // Constantes
  LOJAS_EXCLUIDAS,
  TAMANHOS_MAIORES,
  REGRAS_FAMILIA,
  FAMILIAS_CONTINUAS,
  FAMILIAS_EDICAO_LIMITADA,
  CORES_PERMANENTES,
  ENVIO_MARAPONGA
};
