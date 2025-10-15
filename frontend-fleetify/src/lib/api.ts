import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Employee API
export const employeeApi = {
  getAll: () => api.get('/employees'),
  create: (data: any) => api.post('/employees', data),
  update: (id: number, data: any) => api.put(`/employees/${id}`, data),
  delete: (id: number) => api.delete(`/employees/${id}`),
};

// Department API
export const departmentApi = {
  getAll: () => api.get('/departments'),
  create: (data: any) => api.post('/departments', data),
  update: (id: number, data: any) => api.put(`/departments/${id}`, data),
  delete: (id: number) => api.delete(`/departments/${id}`),
};

// Attendance API
export const attendanceApi = {
  clockIn: (data: any) => api.post('/attendance/clock-in', data),
  clockOut: (data: any) => api.put('/attendance/clock-out', data),
  getLogs: (params: any) => api.get('/attendance/logs', { params }),
};

export default api;