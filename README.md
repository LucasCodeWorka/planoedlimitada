# Dashboard de Plano de Produção

Dashboard corporativo dark theme para visualização e análise de planos de produção **Verão 26 e Verão 27**, construído com React, Recharts e Tailwind CSS.

## ⚠️ DADOS REAIS

Este dashboard utiliza **dados reais** extraídos dos arquivos:
- `projecao_verao_27_final.csv` (Plano 2026)
- `VERAO 26.csv` (Vendas 2025)

**Estatísticas atuais:**
- 📊 **Plano 2026**: 25.954 unidades
- 📈 **Venda 2025**: 21.690 unidades
- 👥 **14 Famílias** | **9 Grupos** | **3 Linhas**

## 🎨 Características

- **Dark Theme Corporativo**: Visual profissional estilo Power BI
- **Filtros Interativos**: 8 filtros dinâmicos que afetam todos os componentes
- **6 KPI Cards**: Métricas principais com destaque visual
- **Gráficos Interativos**: 4 gráficos de barras horizontais + 1 gráfico de produção mensal
- **Tabelas Hierárquicas**: Expansível com drill-down por níveis
- **Matriz Comparativa**: Comparação entre lojas e anos

## 📦 Tecnologias

- **React 18** - Framework UI
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passo a passo

1. Entre na pasta do projeto:
```bash
cd dashboard-producao
```

2. Instale as dependências:
```bash
npm install
```

3. Rode o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra o navegador em: **http://localhost:3000**

## 📁 Estrutura do Projeto

```
dashboard-producao/
├── data.js                          # Dados mockados
├── src/
│   ├── components/
│   │   ├── KpiCard.jsx             # Card de KPI
│   │   ├── FilterBar.jsx           # Barra de filtros
│   │   ├── HorizontalBarChart.jsx  # Gráfico de barras horizontal
│   │   ├── MonthlyProductionChart.jsx # Gráfico de produção mensal
│   │   ├── PlanTable.jsx           # Tabela hierárquica expansível
│   │   └── ComparativeMatrix.jsx   # Matriz comparativa
│   ├── App.jsx                     # Componente principal
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Estilos globais
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Paleta de Cores

| Nome | Hex | Uso |
|------|-----|-----|
| Background principal | `#0B0F2A` | Fundo da aplicação |
| Background cards | `#141836` | Cards e painéis |
| Background tabela | `#101428` | Linhas de tabela |
| Borda sutil | `#1E2548` | Bordas e separadores |
| Accent laranja | `#FF6B00` | Cor principal de destaque |
| Accent ciano | `#00C5CD` | Cor secundária |
| Texto branco | `#FFFFFF` | Textos principais |
| Texto secundário | `#8A8FAD` | Labels e textos auxiliares |

## 🔧 Customização

### Substituir dados mockados

Edite o arquivo `data.js` com seus dados reais. O formato está estruturado e comentado.

### Adicionar lógica de filtro

A função `filterData` em `App.jsx` está preparada para receber sua lógica customizada de filtragem.

### Ajustar cores

Edite `tailwind.config.js` para modificar a paleta de cores do tema.

## 📊 Componentes

### KPI Cards
6 cards com métricas principais, cores configuráveis (laranja/ciano/branco) e linha de destaque no topo.

### Filtros
8 dropdowns interativos: EMPRESA, FAMÍLIA, LINHA, GRUPO, CONTINUIDADE, COLEÇÃO, MÊS, REF-PRODUTO.

### Gráficos de Barras Horizontais
4 gráficos lado a lado mostrando rankings por: GRUPO, FAMÍLIA, LINHA e REFERÊNCIAS (top 7).

### Gráfico de Produção Mensal
Barras verticais com valores por mês (DEZEMBRO, JANEIRO, FEVEREIRO, MARÇO).

### Tabela Hierárquica
Expansível por níveis: COLEÇÃO → FAMÍLIA → GRUPO → REF → COR → TAM, com totais por nível.

### Matriz Comparativa
Tabela matricial comparando FAMÍLIA x LOJAS com colunas 2025 e 2026 para cada loja.

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run preview  # Preview do build
```

## 📝 Notas

- Dashboard otimizado para telas **1440px+**
- Números formatados em **pt-BR** (ex: 31.381)
- Tooltips customizados dark theme em todos os gráficos
- Scroll horizontal/vertical onde necessário
- Responsividade adaptada para uso em monitores grandes

## 🔄 Atualizar Dados

Para atualizar o dashboard com novos dados dos CSVs:

```bash
# 1. Voltar para a pasta raiz
cd ..

# 2. Rodar o script Python
python gerar_dados_dashboard.py

# 3. Os dados serão atualizados automaticamente em dados_reais.json
```

## ⚠️ PENDÊNCIAS

### 📋 Dados por EMPRESA
**Status:** Não implementado

Os filtros por EMPRESA já estão no dashboard, mas faltam dados reais. Para implementar:

1. **Adicionar coluna EMPRESA** nos CSVs de origem (`projecao_verao_27_final.csv` e `VERAO 26.csv`)
2. **Modificar** o script `gerar_dados_dashboard.py` para processar dados por empresa
3. **Atualizar** automaticamente `dados_reais.json`

### 📝 Outras Melhorias Futuras
- Implementar lógica completa de filtragem (atualmente básica)
- Adicionar persistência de estado dos filtros (localStorage)
- Integrar com API backend (se aplicável)
- Adicionar dados de Inverno 26 e Alto Inverno 26

## 🎯 Próximos Passos

1. ✅ ~~Substituir dados mock pelos dados reais~~ (CONCLUÍDO)
2. 🔄 Adicionar dados por EMPRESA (PENDENTE)
3. 🔄 Implementar lógica completa de filtragem
4. 🔄 Adicionar persistência de estado dos filtros

---

**Desenvolvido com React + Vite + Tailwind CSS**
**Dados reais de:** Verão 26 e Verão 27
