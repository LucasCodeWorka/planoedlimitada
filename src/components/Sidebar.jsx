import React from 'react';
import {
  Factory,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Type,
  RotateCcw
} from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed, zoom, setZoom, fontSize, setFontSize }) => {
  // Dashboard único - sem abas não implementadas
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
  ];

  // Controles de zoom (80% a 150%)
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 80));
  const resetZoom = () => setZoom(100);

  // Controles de fonte (80% a 150%)
  const handleFontUp = () => setFontSize(prev => Math.min(prev + 10, 150));
  const handleFontDown = () => setFontSize(prev => Math.max(prev - 10, 80));
  const resetFont = () => setFontSize(100);

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#585858] transition-all duration-300 z-40 flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="px-4 py-4 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#B3838C] rounded-lg flex items-center justify-center flex-shrink-0">
            <Factory size={20} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-white font-bold text-sm tracking-wide">LIEBE</h1>
              <p className="text-gray-400 text-[10px] uppercase tracking-wider">Produção</p>
            </div>
          )}
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#B3838C] text-white"
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-xs font-medium truncate">{item.label}</span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Controles de Visualização */}
      <div className="border-t border-gray-600 p-4 space-y-4">
        {/* Controle de Zoom */}
        <div>
          {!collapsed && (
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <ZoomIn size={10} /> Zoom: {zoom}%
            </p>
          )}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-2'}`}>
            <button
              onClick={handleZoomOut}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
              title="Diminuir zoom"
            >
              <ZoomOut size={16} />
            </button>
            {!collapsed && (
              <button
                onClick={resetZoom}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
                title="Resetar zoom"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              onClick={handleZoomIn}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
              title="Aumentar zoom"
            >
              <ZoomIn size={16} />
            </button>
          </div>
        </div>

        {/* Controle de Fonte */}
        <div>
          {!collapsed && (
            <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Type size={10} /> Fonte: {fontSize}%
            </p>
          )}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'gap-2'}`}>
            <button
              onClick={handleFontDown}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors text-xs font-bold"
              title="Diminuir fonte"
            >
              A-
            </button>
            {!collapsed && (
              <button
                onClick={resetFont}
                className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors"
                title="Resetar fonte"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button
              onClick={handleFontUp}
              className="flex-1 flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded transition-colors text-xs font-bold"
              title="Aumentar fonte"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Info Versão */}
      <div className="border-t border-gray-600 p-3">
        {!collapsed && (
          <div className="text-[10px] text-gray-500 text-center">
            Verão 2027 • v1.0
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-[#585858] border border-gray-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
};

export default Sidebar;
