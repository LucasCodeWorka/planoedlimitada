import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { Download } from 'lucide-react';
import { exportGraficoData } from '../utils/exportExcel';

// Formatador de números
const fmt = (v, dec = 0) => Number(v || 0).toLocaleString('pt-BR', {
  minimumFractionDigits: dec,
  maximumFractionDigits: dec,
});

// Paleta de cores inspirada no dashboard de controladoria
const CHART_COLORS = {
  'Por Grupo': '#6B8E7B',       // Verde suave (similar ao Giro de Estoque)
  'Por Subgrupo': '#7B8B9E',    // Azul acinzentado
  'Por Família': '#B3838C',     // Rosa (cor principal LIEBE)
  'Por Linha': '#9B8AA6',       // Roxo suave (similar ao Giro MP)
  'Por Referência': '#8B9E9E',  // Verde água/cinza
  'default': '#B3838C'
};

const HorizontalBarChart = ({ data, title, subtitle, color }) => {
  // Se color foi passado, usa ele; senão usa a paleta por título
  const chartColor = color || CHART_COLORS[title] || CHART_COLORS.default;

  // Calcular altura dinâmica baseada no número de itens (28px por barra)
  const chartHeight = Math.max(280, data.length * 28);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-[#1D1D1D] font-semibold text-xs mb-0.5">{payload[0].payload.nome}</p>
          <p className="text-sm font-bold font-mono tabular-nums" style={{ color: chartColor }}>
            {fmt(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    const maxLength = 18;
    let text = payload.value || '';

    if (text.length > maxLength) {
      text = text.substring(0, maxLength - 2) + '..';
    }

    return (
      <text
        x={x - 4}
        y={y}
        textAnchor="end"
        fill="#585858"
        fontSize="9"
        fontWeight="500"
        dy={3}
      >
        {text}
      </text>
    );
  };

  const renderCustomLabel = (props) => {
    const { x, y, width, value } = props;
    return (
      <text
        x={x + width + 6}
        y={y + 10}
        fill="#1D1D1D"
        fontSize="10"
        fontWeight="600"
        fontFamily="ui-monospace, monospace"
        textAnchor="start"
      >
        {fmt(value)}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden min-w-0">
      {/* Header colorido */}
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ backgroundColor: chartColor }}>
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[9px] text-white/80 mt-0.5">{subtitle}</p>
          )}
        </div>
        <button
          onClick={() => exportGraficoData(data, title, `${title.replace('Por ', '').toLowerCase()}_${subtitle?.replace(' ', '_').toLowerCase() || 'dados'}`)}
          className="p-1 bg-white/20 hover:bg-white/30 text-white rounded transition-colors"
          title="Exportar para Excel"
        >
          <Download size={12} />
        </button>
      </div>

      {/* Chart com scroll */}
      <div className="px-2 py-3 overflow-y-auto max-h-[320px]">
        <div style={{ height: chartHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 50, left: 5, bottom: 5 }}
              barSize={20}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
            <XAxis
              type="number"
              stroke="#9CA3AF"
              tick={{ fill: '#6B7280', fontSize: 9 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
            />
            <YAxis
              type="category"
              dataKey="nome"
              stroke="transparent"
              tick={<CustomYAxisTick />}
              width={100}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(179, 131, 140, 0.1)' }} />
            <Bar
              dataKey="valor"
              radius={[0, 4, 4, 0]}
              background={{ fill: '#F9FAFB', radius: [0, 4, 4, 0] }}
            >
              <LabelList dataKey="valor" content={renderCustomLabel} />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColor} />
              ))}
            </Bar>
          </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HorizontalBarChart;
