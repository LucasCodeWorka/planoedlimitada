import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportExcel';

// Formatador de números
const fmt = (v, dec = 0) => Number(v || 0).toLocaleString('pt-BR', {
  minimumFractionDigits: dec,
  maximumFractionDigits: dec,
});

const MonthlyProductionChart = ({ data }) => {
  const chartColor = '#B3838C';

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-lg">
          <p className="text-[#585858] font-semibold text-xs">{payload[0].payload.mes}</p>
          <p className="text-sm font-bold font-mono tabular-nums" style={{ color: chartColor }}>
            {fmt(payload[0].value)} un
          </p>
        </div>
      );
    }
    return null;
  };

  const total = data.reduce((sum, d) => sum + d.valor, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-wide text-[#585858]">
            Plano por Mês de Envio
          </h3>
          <p className="text-[10px] text-gray-500">Distribuição do Plano 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-[#B3838C]">
            Total: {fmt(total)} un
          </span>
          <button
            onClick={() => {
              const exportData = data.map((d) => ({
                'Mês Envio': d.mes,
                'Plano 2026': d.valor,
              }));
              exportToExcel(exportData, 'plano_mes_envio', 'Mês Envio');
            }}
            className="flex items-center gap-1 px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-[10px] rounded transition-colors"
            title="Exportar para Excel"
          >
            <Download size={12} />
            Excel
          </button>
        </div>
      </div>

      {/* Gráfico de Linha */}
      <div className="px-4 py-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="mes"
              stroke="#9CA3AF"
              tick={{ fill: '#585858', fontSize: 11, fontWeight: 500 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={false}
              tickFormatter={(v) => fmt(v)}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="valor"
              stroke={chartColor}
              strokeWidth={3}
              dot={{ fill: chartColor, strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: chartColor }}
            >
              <LabelList
                dataKey="valor"
                position="top"
                fill="#1D1D1D"
                fontSize={11}
                fontWeight="600"
                fontFamily="ui-monospace, monospace"
                formatter={(value) => fmt(value)}
                offset={10}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyProductionChart;
