import { dashboardData as staticDashboardData } from '../../data';

const normalizeBaseUrl = (url) => String(url || '').replace(/\/+$/, '');

export async function loadDashboardData() {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_DASHBOARD_API_URL);

  if (!baseUrl) {
    return {
      data: staticDashboardData,
      source: 'arquivo'
    };
  }

  const response = await fetch(`${baseUrl}/api/dashboard-data`);

  if (!response.ok) {
    throw new Error(`Falha ao carregar dados do banco: HTTP ${response.status}`);
  }

  const data = await response.json();

  return {
    data,
    source: data?.meta?.origem === 'arquivo-local' ? 'api-arquivo' : 'banco'
  };
}

export { staticDashboardData };
