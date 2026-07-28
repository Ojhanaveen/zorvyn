import client from './client';

export const getBudgets = () =>
  client.get('/budgets').then((res) => res.data);

export const createBudget = (payload) =>
  client.post('/budgets', payload).then((res) => res.data);

export const updateBudget = (id, payload) =>
  client.put(`/budgets/${id}`, payload).then((res) => res.data);

export const deleteBudget = (id) =>
  client.delete(`/budgets/${id}`).then((res) => res.data);
