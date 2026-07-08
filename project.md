# Dashboard de Produção - Edição Limitada

## Visão Geral

Dashboard interativo para visualização e análise do plano de produção de coleções de moda (Verão 26 e Verão 27). O sistema permite comparar vendas realizadas em 2025 com o planejamento para 2026, fornecendo análises detalhadas por família, loja, grupo, linha e SKU.

## Tecnologias

- **React** - Framework principal
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones

## Estrutura do Projeto

```
dashboard-producao/
├── src/
│   ├── components/
│   │   ├── ComparativeMatrix.jsx    # Tabela comparativa família x lojas
│   │   ├── FilterBar.jsx            # Barra de filtros
│   │   ├── HorizontalBarChart.jsx   # Gráficos de barras horizontais
│   │   ├── KpiCard.jsx              # Cards de KPI
│   │   ├── MonthlyProductionChart.jsx # Gráfico mensal
│   │   └── PlanTable.jsx            # Tabela detalhada do plano
│   ├── App.jsx                      # Componente principal
│   └── data.js                      # Importação de dados
├── dados_reais.json                 # Dados do dashboard
└── data.js                          # Exportação de dados
```

## Componentes Principais

### 1. App.jsx
**Descrição**: Componente principal que organiza todo o dashboard.

**Funcionalidades**:
- Layout responsivo
- Sistema de filtros (empresa, família, linha, grupo, continuidade, coleção, mês, referência)
- Organização dos componentes em grid

**Estado**:
```javascript
const [filters, setFilters] = useState({
  empresa: 'TODAS',
  familia: 'TODAS',
  linha: 'TODAS',
  grupo: 'TODAS',
  continuidade: 'TODAS',
  colecao: 'TODAS',
  mes: 'TODOS',
  referencia: 'TODAS'
});
```

**Seções**:
1. Header com título e filtros
2. KPI Cards (Plano 2026 e Venda 2025)
3. Grid 2x2 de gráficos (Grupo, Família, Linha, Referências)
4. Gráfico de produção mensal
5. Tabela de plano detalhado
6. Matriz comparativa de lojas

---

### 2. ComparativeMatrix.jsx
**Descrição**: Tabela comparativa hierárquica expandível que mostra vendas 2025 vs plano 2026 por empresa, família, referência, cor e tamanho.

**Props**:
```javascript
{
  data: {
    lojas: string[],           // Lista de lojas
    familias: [{
      nome: string,
      vendas2025: number[],    // Vendas por loja
      plano2026: number[]      // Plano por loja
    }]
  }
}
```

**✨ NOVA Estrutura Hierárquica Expandível**:
```
📦 EMPRESA (expandível) - ex: KISS ME, DELICATTI, VISCOW
  └─ 👗 FAMÍLIA (expandível) - ex: PORTELLE, LOVE APPEAL
      └─ 🏷️ REFERÊNCIA (expandível) - ex: 501149 - CALCINHA BIQUINI
          └─ 🎨 COR (expandível) - ex: BRANCO, NECTAR
              └─ 📏 TAMANHO (SKU) - ex: P, M, G, GG
```

**Mapeamento Família → Empresa**:
```javascript
const FAMILIA_EMPRESA = {
  'KISS ME': 'KISS ME',
  'KISS ME PLUS': 'KISS ME',
  'LOVE APPEAL': 'KISS ME',
  'LOVELY': 'KISS ME',
  'WISHES': 'KISS ME',
  'LACE': 'KISS ME',
  'NOIVAS': 'KISS ME',
  'VISCOW': 'VISCOW',
  'DELICATTI': 'DELICATTI',
  'PORTELLE': 'DELICATTI',
  'CETIM': 'DELICATTI',
  'AQUALUME': 'DELICATTI',
  'BLOOM': 'DELICATTI',
  'AFTER SUN': 'DELICATTI',
  'FLOR DO OCEANO': 'DELICATTI'
};
```

**Funcionalidades**:
- **Hierarquia expandível**: Empresa → Família → Ref → Cor → Tam
- Cálculo automático de percentuais de variação em todos os níveis
- Totalizadores por empresa, família e geral
- Limite máximo de 12% aplicado automaticamente
- Código de cores por nível hierárquico:
  - Cinza escuro: Empresa
  - Cinza claro: Família
  - Azul: Referência
  - Roxo: Cor
  - Verde: Tamanho (SKU)
- Ícones de expansão (chevron) em cada nível
- Legenda de cores no rodapé

**Modal de Detalhamento**:
Ao clicar em uma célula de percentual, exibe:

1. **Informações Básicas**:
   - Família
   - Loja

2. **Cálculo do Percentual**:
   - Vendas 2025
   - Plano 2026
   - Diferença

3. **Fórmula e Resultado**:
   - Fórmula: ((2026 - 2025) / 2025) × 100
   - Resultado percentual

4. **Alerta de Variação**:
   - Aviso quando variação > 10%

5. **✨ NOVO: Composição do Plano 2026**:
   - Tabela detalhada de SKUs da família
   - Colunas: Referência, Cor, Tamanho, Plano
   - Total de SKUs
   - Total geral de unidades
   - Nota explicativa sobre distribuição proporcional entre lojas

**Estrutura do Modal**:
```javascript
modalData: {
  familia: string,              // Nome da família
  loja: string,                 // Nome da loja
  val2025: number,              // Vendas 2025
  val2026: number,              // Plano 2026
  percentual: number,           // Percentual calculado
  diferenca: number,            // Diferença absoluta
  skusDetalhados: [{            // ✨ NOVO
    ref: string,
    cor: string,
    tam: string,
    plano: number
  }],
  totalPlanoDetalhado: number   // ✨ NOVO
}
```

**Cálculos**:
```javascript
// Percentual por célula
percentual = ((val2026 - val2025) / val2025) * 100

// Totais por loja
total2025 = sum(familias.vendas2025[lojaIdx])
total2026 = sum(familias.plano2026[lojaIdx])

// Totais por família
totalFam2025 = sum(familia.vendas2025)
totalFam2026 = sum(familia.plano2026)

// Total geral
totalGeral2025 = sum(totaisPorLoja.total2025)
totalGeral2026 = sum(totaisPorLoja.total2026)
```

**Importações**:
```javascript
import { planoEdicaoLimitadaData } from '../../data';
```

---

### 3. PlanTable.jsx
**Descrição**: Tabela hierárquica expandível com plano de produção detalhado.

**Props**:
```javascript
{
  data: [{
    colecao: string,
    familia: string,
    grupo: string,
    ref: string,
    cor: string,
    tam: string,
    plano: number
  }]
}
```

**Estrutura Hierárquica**:
```
📦 REFERÊNCIA (expandível)
  └─ 🎨 COR (expandível)
      └─ 📏 TAMANHO
          └─ Valores por família
```

**Estado**:
```javascript
const [expanded, setExpanded] = useState({});
// Controla quais níveis estão expandidos
```

**Funcionalidades**:
- Agrupamento REF → COR → TAM → FAMÍLIA
- Expansão/colapso de níveis
- Totalizadores em todos os níveis
- Sticky headers e footers
- Scroll vertical com altura máxima

**Totalizadores**:
- Total por referência (todas as cores e tamanhos)
- Total por cor (todos os tamanhos)
- Total por tamanho (todas as famílias)
- Total por família (rodapé sticky)
- Total geral

---

### 4. HorizontalBarChart.jsx
**Descrição**: Gráfico de barras horizontais customizado.

**Props**:
```javascript
{
  data: [{
    nome: string,
    valor: number
  }],
  title: string,
  chartColor: string  // Cor hexadecimal
}
```

**Customizações**:
- Tooltip personalizado com valores formatados
- Labels de valor ao lado das barras
- Truncamento inteligente de nomes longos (max 18 caracteres)
- Background colorido nas barras
- Grid vertical

**Cores por Gráfico**:
- Grupo: `#7B9B7B` (verde)
- Família: `#8B7B9B` (roxo)
- Linha: `#9B8B7B` (marrom)
- Ref: `#7B8B9B` (azul)

---

### 5. MonthlyProductionChart.jsx
**Descrição**: Gráfico de barras verticais para produção mensal.

**Props**:
```javascript
{
  data: [{
    mes: string,
    valor: number
  }]
}
```

**Funcionalidades**:
- Barras verticais com cantos arredondados
- Labels de valor acima das barras
- Tooltip customizado
- Cor padrão: `#B76B79` (rosa LIEBE)

---

### 6. KpiCard.jsx
**Descrição**: Cards coloridos para exibição de KPIs.

**Props**:
```javascript
{
  label: string,
  value: number,
  accentColor: 'rose' | 'purple' | 'green' | 'blue' | 'brown' | 'teal'
}
```

**Paleta de Cores**:
```javascript
rose:   { bg: '#B76B79', text: 'white' }  // Rosa LIEBE
purple: { bg: '#8B7B9B', text: 'white' }  // Roxo suave
green:  { bg: '#7B9B7B', text: 'white' }  // Verde suave
blue:   { bg: '#7B8B9B', text: 'white' }  // Azul suave
brown:  { bg: '#9B8B7B', text: 'white' }  // Marrom suave
teal:   { bg: '#7B9B9B', text: 'white' }  // Azul esverdeado
```

---

### 7. FilterBar.jsx
**Descrição**: Barra de filtros com 8 seletores.

**Props**:
```javascript
{
  filters: {
    empresa: string,
    familia: string,
    linha: string,
    grupo: string,
    continuidade: string,
    colecao: string,
    mes: string,
    referencia: string
  },
  setFilters: function,
  options: {
    empresas: string[],
    familias: string[],
    linhas: string[],
    grupos: string[],
    continuidades: string[],
    colecoes: string[],
    meses: string[],
    referencias: string[]
  }
}
```

**Layout**: Grid de 8 colunas responsivo

---

## Estrutura de Dados

### dados_reais.json

```json
{
  "filterOptions": {
    "empresas": ["TODAS", "KISS ME", "DELICATTI", "VISCOW"],
    "familias": ["TODAS", "AFTER SUN", "AQUALUME", ...],
    "linhas": ["TODAS", "FASHION", "LOUNGEWEAR", "LUXE"],
    "grupos": ["TODAS", "BODY", "CALCA", "CAMISOLA", ...],
    "continuidades": ["TODAS", "PERMANENTE", "EDICAO LIMITADA"],
    "colecoes": ["TODAS", "VERAO 27", "VERAO 26"],
    "meses": ["TODOS", "DEZEMBRO", "JANEIRO", ...],
    "referencias": ["TODAS", "501021", "501049", ...]
  },

  "kpiData": {
    "plano2026": 25954,
    "venda2025": 21690
  },

  "grupoData": [
    { "nome": "CALCA", "valor": 17200 },
    { "nome": "SUTIA", "valor": 6066 }
  ],

  "familiaData": [...],
  "linhaData": [...],
  "refData": [...],

  "mesProducaoData": [
    { "mes": "DEZEMBRO", "valor": 8500 },
    { "mes": "JANEIRO", "valor": 7200 }
  ],

  "planoEdicaoLimitadaData": [
    {
      "colecao": "VERAO 27",
      "familia": "AFTER SUN",
      "grupo": "CALCA",
      "ref": "501149 - CALCINHA BIQUINI",
      "cor": "BRANCO",
      "tam": "G",
      "plano": 17
    }
  ],

  "comparativoLojasData": {
    "lojas": ["MARAPONGA", "IGUATEMI", "PORTO ALEGRE", ...],
    "familias": [
      {
        "nome": "KISS ME",
        "vendas2025": [282, 314, 240, ...],
        "plano2026": [364, 405, 310, ...]
      }
    ]
  }
}
```

---

## Paleta de Cores

### Cores Principais
- **Rosa LIEBE**: `#B76B79` - Header, KPIs, gráfico mensal
- **Rosa Escuro**: `#A05565` - Bordas
- **Cinza Texto**: `#575756` - Textos gerais
- **Background**: `#F5F5F5` - Fundo da página

### Cores de Gráficos
- **Verde**: `#7B9B7B` - Grupo
- **Roxo**: `#8B7B9B` - Família
- **Marrom**: `#9B8B7B` - Linha
- **Azul**: `#7B8B9B` - Referências

### Cores de Estado
- **Positivo**: `text-green-600` (#16a34a)
- **Negativo**: `text-red-600` (#dc2626)
- **Alerta**: `bg-yellow-50` com borda `border-yellow-400`

---

## Funcionalidades Implementadas

### ✅ Visualizações
- [x] KPIs totalizadores
- [x] Gráficos de barras horizontais (4 tipos)
- [x] Gráfico de produção mensal
- [x] Tabela hierárquica expandível
- [x] Matriz comparativa de lojas
- [x] Modal de detalhamento com memória de cálculo
- [x] Detalhamento de SKUs no modal
- [x] **✨ NOVO: Limite máximo de 12% de variação em todo o plano**

### ✅ Interatividade
- [x] Filtros por 8 dimensões
- [x] Expansão/colapso de hierarquias
- [x] Células clicáveis com modal
- [x] Tooltips informativos
- [x] Alertas de variação
- [x] **✨ NOVO: Indicadores visuais de valores ajustados**

### ✅ UX/UI
- [x] Layout responsivo
- [x] Sticky headers/footers
- [x] Hover states
- [x] Cores consistentes
- [x] Formatação de números (pt-BR)
- [x] Scroll customizado
- [x] Modal largo e scrollável para SKUs
- [x] **✨ NOVO: Banner de alerta quando limite é aplicado**

---

---

## REGRAS DE DISTRIBUIÇÃO DO PLANO

### 1. REGRA ESPECÍFICA – LOVE APPEAL
Regra especial para a família LOVE APPEAL:
- **Sutiãs**: tamanhos 42 ou 44
- **Calcinhas**: tamanhos M ou G
- **Grade mínima**: 02 peças

### 2. FAMÍLIAS – REFERÊNCIAS EDIÇÃO LIMITADA
- Quando houver **venda zero**, o arredondamento para 1 peça será aplicado somente nos **dois tamanhos mais vendidos** de todos os grupos
- Considera o **geral das lojas**, EXCETO **LOJA JOQUEI**

### 3. EDIÇÃO PERMANENTE
- Deve ter no **mínimo 01 peça**, somente em **cores permanentes**
- **Cores de moda** (edição limitada) **NÃO entram**, mesmo que a referência seja edição permanente
- **Tamanhos maiores NÃO entram** nesta regra (seguem regra específica abaixo)

### 4. TAMANHOS MAIORES – EDIÇÃO LIMITADA
**Exceção**: KISS ME (tratada como edição permanente, enviada apenas para MARAPONGA)

**Envio para todas as lojas, EXCETO**:
- JOQUEI
- DOM LUIS
- ECOMMERCE

**Grade mínima**:
| Grupo | Tamanho | Quantidade |
|-------|---------|------------|
| Sutiãs | 48 | 01 peça |
| Sutiãs | 50 | 01 peça |
| Calcinhas | GG | 01 peça |
| Calcinhas | XG | 01 peça |

### 5. TAMANHOS MAIORES – EDIÇÃO PERMANENTE (CONFORT e KISS ME)
- **Envio exclusivo** para a loja **MARAPONGA**

### 6. REGRAS DE ARREDONDAMENTO
| Valor Calculado | Arredondamento |
|-----------------|----------------|
| Abaixo de 1 | → 1 |
| De 1,00 a 1,49 | → 1 |
| De 1,50 a 1,99 | → 2 |

### 7. COMPARAÇÃO DE VENDAS POR GRUPO – ANO ANTERIOR
**Critério de mês**: O mês de envio dos grupos deve ser igual na comparação entre anos.

**Exemplos**:
- Venda fevereiro (envio janeiro) 2025 × Venda fevereiro (envio janeiro) 2026
- Venda março (envio fevereiro) 2025 × Venda março (envio fevereiro) 2026

**Caso não exista venda no mesmo ano**: buscar o ano anterior mais próximo

**Critérios adicionais**:
- Comparação sempre pelo **grupo do produto** (fio dental × fio dental, biquíni × biquíni, etc.)
- Média de vendas LUXE e FASHION (edição limitada) → feita somente entre essas duas famílias

**Famílias que NÃO entram na média** (mantêm mesmo nome):
- Love Appeal
- Noivas
- Kiss Me
- Cetim
- Lace
- Control, etc.

**Famílias contínuas**:
- Analisar apenas sua **própria venda histórica**
- Ex.: Camisola Noivas comparada com Camisola Noivas do ano anterior

**Famílias de Loungewear**:
- Cetim
- Viscow
- Lace, etc.

### 8. ENVIO MARAPONGA – PLANO (APLICAÇÃO NO PRÓXIMO SEMESTRE)
**Coleção 2º semestre – VERÃO**:
| Período | Percentual |
|---------|------------|
| Junho | 50% das referências |
| Agosto | 50% das referências |

---

## Regras de Distribuição - Módulo Implementado

### Arquivo: `src/utils/distributionRules.js`

Módulo centralizado com todas as regras de distribuição do plano. Cada função pode ser usada individualmente ou através da função principal `aplicarRegrasDistribuicao()`.

### Constantes Exportadas

```javascript
// Lojas excluídas de certas regras
LOJAS_EXCLUIDAS = {
  TAMANHOS_MAIORES: ['JOQUEI', 'DOM LUIS', 'ECOMMERCE', 'NORTH JOQUEI'],
  VENDA_ZERO: ['JOQUEI', 'NORTH JOQUEI']
}

// Tamanhos maiores por grupo
TAMANHOS_MAIORES = {
  SUTIA: ['48', '50'],
  CALCA: ['GG', 'XG', 'EG']
}

// Regras por família
REGRAS_FAMILIA = {
  'LOVE APPEAL': {
    SUTIA: { tamanhos: ['42', '44'], gradeMinima: 2 },
    CALCA: { tamanhos: ['M', 'G'], gradeMinima: 2 }
  }
}

// Famílias contínuas
FAMILIAS_CONTINUAS = ['LOVE APPEAL', 'NOIVAS', 'KISS ME', 'CETIM', 'LACE', 'CONTROL', 'VISCOW']

// Famílias de edição limitada
FAMILIAS_EDICAO_LIMITADA = ['LUXE', 'FASHION']

// Cores permanentes
CORES_PERMANENTES = ['PRETO', 'BRANCO', 'NUDE', 'CHOCOLATE', 'MARINHO']

// Envio MARAPONGA
ENVIO_MARAPONGA = { percentualJunho: 0.5, percentualAgosto: 0.5, meses: ['JUNHO', 'AGOSTO'] }
```

### Funções por Regra

#### Regra 1: LOVE APPEAL
```javascript
aplicarRegraLoveAppeal(sku, quantidade)
// - Sutiãs: apenas 42/44
// - Calcinhas: apenas M/G
// - Grade mínima: 02 peças
// Retorna: { valido, quantidade, motivo }
```

#### Regra 2: Venda Zero
```javascript
encontrarTamanhosMaisVendidos(dadosVendas, grupo)
// Encontra os 2 tamanhos mais vendidos (excl. JOQUEI)
// Retorna: Array com 2 tamanhos

aplicarRegraVendaZero(sku, vendaAnterior, tamanhosMaisVendidos)
// Arredonda para 1 apenas nos 2 tam. mais vendidos quando venda = 0
// Retorna: { quantidade, motivo }
```

#### Regra 3: Edição Permanente
```javascript
aplicarRegraEdicaoPermanente(sku, quantidade)
// - Mínimo 01 peça em cores permanentes
// - Cores permanentes: PRETO, BRANCO, NUDE, CHOCOLATE, MARINHO
// Retorna: { valido, quantidade, motivo }
```

#### Regra 4: Tamanhos Maiores - Edição Limitada
```javascript
aplicarRegraTamanhosMaioresEdicaoLimitada(sku, loja, quantidade)
// - Exclui: JOQUEI, DOM LUIS, ECOMMERCE, NORTH JOQUEI
// - Tam. maiores: Sutiã 48/50, Calcinha GG/XG/EG
// Retorna: { valido, quantidade, motivo }
```

#### Regra 5: Tamanhos Maiores - Permanente
```javascript
aplicarRegraTamanhosMaioresPermanente(sku, loja, quantidade)
// - Apenas MARAPONGA recebe tamanhos maiores em permanente
// Retorna: { valido, quantidade, motivo }
```

#### Regra 6: Arredondamento
```javascript
aplicarArredondamento(valor)
// - valor <= 0: retorna 0
// - valor < 1: retorna 1
// - valor < 1.5: retorna 1
// - valor < 2: retorna 2
// - outros: Math.round(valor)
```

#### Regra 7: Comparação Vendas
```javascript
calcularComparacaoVendasGrupo(vendasAnoAnterior, grupo, planoTotal)
// - Calcula participação % do grupo
// - Distribui plano proporcionalmente
// Retorna: { quantidade, percentual, motivo }
```

#### Regra 8: Envio MARAPONGA
```javascript
aplicarRegraEnvioMaraponga(loja, quantidade, mes)
// - 50% junho, 50% agosto
// - Outros meses: 0
// Retorna: { quantidade, motivo }

calcularDistribuicaoMaraponga(quantidadeTotal)
// Retorna: { junho, agosto }
```

### Função Principal

```javascript
aplicarRegrasDistribuicao(sku, contexto)
// Aplica TODAS as regras na ordem correta
//
// sku = { familia, grupo, tam, ref, cor }
// contexto = { vendaAnterior, tamanhosMaisVendidos, loja, mes }
//
// Retorna: { quantidade, bloqueado, regrasAplicadas }
```

### Utilitários

```javascript
isLojaExcluidaTamanhosMaiores(loja)
isTamanhoMaior(tamanho, grupo)
isFamiliaContinua(familia)
```

---

## Funcionalidades Pendentes

### 🔄 TODO
- [ ] Implementar lógica real de filtros (atualmente retorna dados sem filtrar)
- [ ] Adicionar filtro por EMPRESA nos dados
- [x] **Implementar regras de distribuição**:
  - [x] Regra 1: LOVE APPEAL (sutiãs 42/44, calcinhas M/G, grade mínima 02)
  - [x] Regra 2: Venda zero (arredondamento nos 2 tamanhos mais vendidos, exceto JOQUEI)
  - [x] Regra 3: Edição permanente (mínimo 01 peça, cores permanentes)
  - [x] Regra 4: Tamanhos maiores edição limitada (excluir JOQUEI, DOM LUIS, ECOMMERCE)
  - [x] Regra 5: Tamanhos maiores permanente (apenas MARAPONGA)
  - [x] Regra 6: Arredondamento (<1→1, 1-1.49→1, 1.5-1.99→2)
  - [x] Regra 7: Comparação de vendas por grupo/ano anterior
  - [x] Regra 8: Envio MARAPONGA 50%/50% (junho/agosto)
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Gráficos adicionais (pizza, linha temporal)
- [ ] Comparação multi-período
- [ ] Drill-down em gráficos
- [ ] Favoritos/salvamento de filtros

---

## Fluxo de Dados

```
dados_reais.json
    ↓
data.js (importação)
    ↓
App.jsx (distribuição)
    ↓
    ├─→ KpiCard (kpiData)
    ├─→ HorizontalBarChart (grupoData, familiaData, linhaData, refData)
    ├─→ MonthlyProductionChart (mesProducaoData)
    ├─→ PlanTable (planoEdicaoLimitadaData)
    └─→ ComparativeMatrix (comparativoLojasData + planoEdicaoLimitadaData)
```

---

## Casos de Uso

### 1. Análise de Variação por Loja
**Objetivo**: Entender porque uma loja tem variação alta

**Passos**:
1. Visualizar matriz comparativa
2. Identificar células com variação > 10% (destacadas em amarelo)
3. Clicar na célula de percentual
4. Modal exibe:
   - Cálculo detalhado da variação
   - **✨ Lista completa de SKUs** que compõem o plano 2026
   - Detalhamento por referência, cor e tamanho
   - Total de unidades planejadas
   - Explicação sobre distribuição entre lojas

**Exemplo**:
- PORTELLE em MORUMBI: +40.5%
- Modal mostra que o plano total de PORTELLE é distribuído proporcionalmente
- Lista todos os SKUs (refs, cores, tamanhos) que formam o total

### 2. Análise de Produção por Família
**Objetivo**: Ver detalhes de produção de uma família

**Passos**:
1. Acessar tabela de plano de produção
2. Encontrar a família desejada
3. Expandir referência
4. Expandir cor
5. Ver quantidade por tamanho e família

### 3. Visão Geral de Grupos
**Objetivo**: Entender distribuição de produção por grupo

**Passos**:
1. Visualizar gráfico "2026 GRUPO"
2. Comparar valores entre grupos
3. Usar tooltip para valores exatos

---

## Performance

### Otimizações Implementadas
- Sticky positioning para headers/footers
- Scroll virtualizado em tabelas grandes
- Renderização condicional (expanded state)
- Memoização de cálculos (totalizadores)

### Limites
- Tabela de plano: máx 700px altura com scroll
- Modal de SKUs: máx 264px altura (max-h-64) com scroll
- Modal geral: máx 90vh altura total
- Gráficos: height fixo para consistência

---

## Convenções de Código

### Nomenclatura
- Componentes: PascalCase
- Props: camelCase
- Funções: camelCase
- Constantes: UPPER_SNAKE_CASE (dados)
- Classes CSS: kebab-case (Tailwind)

### Formatação de Números
```javascript
valor.toLocaleString('pt-BR')
// 1000 → "1.000"
// 25954 → "25.954"
```

### Formatação de Percentuais
```javascript
percentual.toFixed(1) + '%'
// 40.5432 → "40.5%"
// -12.8765 → "-12.9%"
```

---

## Comandos de Desenvolvimento

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

---

## Dependências Principais

```json
{
  "react": "^18.x",
  "react-dom": "^18.x",
  "recharts": "^2.x",
  "lucide-react": "^0.x",
  "tailwindcss": "^3.x"
}
```

---

## Logs de Mudanças Recentes

### 2024 - Tabela Hierárquica por Empresa até SKU
**Modificado**: `ComparativeMatrix.jsx`

**Problema Original**:
- Tabela mostrava apenas família x loja
- Usuário queria ver detalhamento por empresa até nível de SKU

**Solução Implementada**:
1. Estrutura hierárquica expandível: Empresa → Família → Ref → Cor → Tam
2. Mapeamento de famílias para empresas (KISS ME, DELICATTI, VISCOW)
3. Estado de expansão independente para cada nível
4. Cores diferenciadas por nível hierárquico
5. Legenda visual no rodapé
6. Totalizadores em todos os níveis

**Níveis da Hierarquia**:
- **Empresa** (cinza escuro): Agrupa famílias por marca
- **Família** (cinza claro): Mostra totais por loja
- **Referência** (azul): Lista produtos da família
- **Cor** (roxo): Variações de cor do produto
- **Tamanho** (verde): SKU final com quantidade

---

### 2024 - Limite Máximo de 12% de Variação
**Modificados**: `App.jsx`, `ComparativeMatrix.jsx`

**Problema Original**:
- O plano 2026 tinha variações muito altas em relação a 2025 (ex: +40.5%)
- Usuário queria limitar o crescimento a no máximo 12%

**Solução Implementada**:

1. **App.jsx** - Ajuste Global:
   - Constante `MAX_VARIACAO = 0.12` define o limite
   - Cálculo automático do fator de redução proporcional
   - Todos os dados são ajustados: KPIs, gráficos, tabelas
   - Banner de alerta no topo quando limite é aplicado

2. **ComparativeMatrix.jsx** - Ajuste por Célula:
   - Cada célula família/loja é limitada individualmente
   - Badge "Limite máximo: +12%" no cabeçalho
   - Asterisco (*) em valores ajustados
   - Modal mostra valor original vs ajustado
   - Legenda explicativa no rodapé

**Lógica de Cálculo**:
```javascript
// Limite global (KPIs, gráficos)
const limiteMaximo = Math.round(venda2025 * 1.12);
const fatorReducao = plano2026Original > limiteMaximo
  ? limiteMaximo / plano2026Original
  : 1;

// Limite por célula (matriz comparativa)
const limiteMaximo = Math.round(vendas2025[loja] * 1.12);
const planoAjustado = Math.min(planoOriginal, limiteMaximo);
```

**Exemplo PORTELLE/MORUMBI**:
- Vendas 2025: 74 un
- Plano Original: 104 un (+40.5%)
- **Plano Ajustado: 83 un (+12.2%)** ← máximo permitido

---

### 2024 - Implementação do Modal de SKUs
**Modificado**: `ComparativeMatrix.jsx`

**Adicionado**:
1. Import de `planoEdicaoLimitadaData`
2. Busca de SKUs detalhados ao abrir modal
3. Seção "Composição do Plano 2026 (Verão 27)" no modal
4. Tabela scrollável com colunas: Referência, Cor, Tam, Plano
5. Footer com total de unidades
6. Nota explicativa sobre distribuição proporcional
7. Modal expandido (max-w-3xl) e scrollável (max-h-90vh)

**Problema Resolvido**:
- Usuário não entendia de onde vinha o valor "104 un" para PORTELLE/MORUMBI
- Agora pode ver todos os SKUs que compõem esse total
- Entende que o valor da loja é uma quota proporcional do plano total

---

## Notas Técnicas

### Sticky Positioning
```css
.sticky {
  position: sticky;
  top: 0;      /* Para headers */
  bottom: 0;   /* Para footers */
  z-index: 10; /* Sobrepor conteúdo */
}
```

### Modal Overlay
```jsx
// Overlay clicável fecha modal
<div onClick={closeModal}>
  {/* Conteúdo não propaga click */}
  <div onClick={(e) => e.stopPropagation()}>
    ...
  </div>
</div>
```

### Expand/Collapse State
```javascript
const [expanded, setExpanded] = useState({});

const toggleExpand = (key) => {
  setExpanded(prev => ({
    ...prev,
    [key]: !prev[key]
  }));
};
```

---

## Contato e Suporte

Para dúvidas ou melhorias, consultar:
- Documentação do React: https://react.dev
- Documentação do Recharts: https://recharts.org
- Documentação do Tailwind: https://tailwindcss.com

---

### 2024 - Implementação das Regras de Distribuição (1-8)
**Criado**: `src/utils/distributionRules.js`
**Modificado**: `src/components/PlanTable.jsx`

**Regras Implementadas**:
1. **LOVE APPEAL** - Sutiãs 42/44, Calcinhas M/G, grade mínima 02 peças
2. **Venda Zero** - Arredonda nos 2 tamanhos mais vendidos (excl. JOQUEI)
3. **Edição Permanente** - Mínimo 01 peça em cores permanentes
4. **Tamanhos Maiores Ed. Limitada** - Excl. JOQUEI, DOM LUIS, ECOMMERCE
5. **Tamanhos Maiores Permanente** - Apenas MARAPONGA
6. **Arredondamento** - <1→1, 1-1.49→1, 1.5-1.99→2
7. **Comparação Vendas** - Distribuição proporcional por grupo
8. **Envio MARAPONGA** - 50% junho / 50% agosto

**Estrutura do Módulo**:
```
distributionRules.js
├── Constantes (LOJAS_EXCLUIDAS, TAMANHOS_MAIORES, etc.)
├── Funções por Regra (aplicarRegra...)
├── Função Principal (aplicarRegrasDistribuicao)
└── Utilitários (isLojaExcluida..., isTamanho..., etc.)
```

**Integração no PlanTable**:
- Todas as regras são aplicadas via `useMemo`
- Visual indicators: vermelho (bloqueado), amarelo (ajustado), azul (cor permanente)
- Legenda completa no rodapé da tabela

---

**Última Atualização**: 2024
**Versão**: 1.2.0
**Status**: ✅ Produção (com regras de distribuição implementadas)
