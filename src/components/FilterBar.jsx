import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';

const FilterBar = ({ filters, setFilters, options }) => {
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      empresa: 'TODAS',
      familia: 'TODAS',
      linha: 'TODAS',
      grupo: 'TODAS',
      continuidade: 'TODAS',
      colecao: 'TODAS',
      mes: 'TODOS',
      referencia: 'TODAS'
    });
  };

  const filterConfigs = [
    { key: 'empresa', label: 'Empresa', options: options.empresas },
    { key: 'familia', label: 'Família', options: options.familias },
    { key: 'linha', label: 'Linha', options: options.linhas },
    { key: 'grupo', label: 'Grupo', options: options.grupos },
    { key: 'colecao', label: 'Coleção', options: options.colecoes },
    { key: 'mes', label: 'Mês', options: options.meses },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Label do filtro */}
        <div className="flex items-center gap-2 pr-4 border-r border-gray-200">
          <Filter size={14} className="text-[#B3838C]" />
          <span className="text-[11px] font-semibold text-[#585858] uppercase tracking-wide">Filtros</span>
        </div>

        {/* Campos de filtro */}
        {filterConfigs.map(({ key, label, options: opts }) => (
          <div key={key} className="flex flex-col">
            <label className="text-[10px] font-semibold text-[#585858] mb-1 uppercase tracking-wide">
              {label}
            </label>
            <select
              value={filters[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              className="border border-gray-300 rounded px-2 py-1.5 text-xs text-[#1D1D1D] bg-white min-w-[90px] focus:outline-none focus:ring-1 focus:ring-[#B3838C] focus:border-[#B3838C] cursor-pointer"
            >
              {opts?.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Botão Limpar */}
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors ml-auto"
        >
          <RotateCcw size={12} />
          Limpar
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
