import React from 'react';

// Formatador de números
const fmt = (v, dec = 0) => {
  if (typeof v === 'string') return v;
  return Number(v || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
};

const KpiCard = ({ label, value, type = 'default', isPercentage = false }) => {
  // Tipos de cards seguindo o briefing LIEBE
  const typeStyles = {
    default: {
      border: 'border-gray-200',
      bg: 'bg-gray-50',
      labelColor: 'text-gray-500',
      valueColor: 'text-gray-900'
    },
    primary: {
      border: 'border-[#B3838C]/30',
      bg: 'bg-[#B3838C]/5',
      labelColor: 'text-[#B3838C]',
      valueColor: 'text-[#1D1D1D]'
    },
    success: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      labelColor: 'text-emerald-600',
      valueColor: 'text-emerald-700'
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      labelColor: 'text-amber-600',
      valueColor: 'text-amber-700'
    },
    danger: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      labelColor: 'text-red-600',
      valueColor: 'text-red-700'
    }
  };

  const styles = typeStyles[type] || typeStyles.default;

  return (
    <div className={`rounded-lg border ${styles.border} ${styles.bg} px-4 py-3`}>
      <div className={`text-[11px] ${styles.labelColor} uppercase tracking-wide font-semibold`}>
        {label}
      </div>
      <div className={`text-xl font-bold font-mono tabular-nums ${styles.valueColor} mt-1`}>
        {isPercentage ? value : fmt(value)}
      </div>
    </div>
  );
};

export default KpiCard;
