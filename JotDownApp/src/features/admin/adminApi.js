import { apiFetch } from '../../services/api';

export const adminApi = {
  getDashboardStats: () => apiFetch('/api/admin/dashboard'),
  
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/users${query ? `?${query}` : ''}`);
  },
  
  getUserDetails: (id) => apiFetch(`/api/admin/users/${id}`),
  
  lockUser: (id, action = 'lock') => apiFetch(`/api/admin/users/${id}/lock`, {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),
  
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/reports${query ? `?${query}` : ''}`);
  },
  
  getReportDetails: (id) => apiFetch(`/api/admin/reports/${id}`),
  
  actionReport: (id, data) => apiFetch(`/api/admin/reports/${id}/action`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getPlans: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/plans${query ? `?${query}` : ''}`);
  },
  
  getPlanDetails: (id) => apiFetch(`/api/admin/plans/${id}`),
  
  createPlan: (data) => apiFetch('/api/admin/plans', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  updatePlan: (id, data) => apiFetch(`/api/admin/plans/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  
  togglePlanStatus: (id) => apiFetch(`/api/admin/plans/${id}/toggle-status`, {
    method: 'POST',
  }),
  
  getPayments: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/payments${query ? `?${query}` : ''}`);
  },
  
  getPaymentDetails: (id) => apiFetch(`/api/admin/payments/${id}`),
  
  confirmPayment: (id) => apiFetch(`/api/admin/payments/${id}/confirm`, {
    method: 'POST',
  }),
  
  getActivityLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/admin/activity-logs${query ? `?${query}` : ''}`);
  },
};
