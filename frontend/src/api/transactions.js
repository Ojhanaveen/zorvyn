import client from './client';

export const getTransactions = (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  return client.get(`/transactions?${params.toString()}`).then((res) => res.data);
};

export const getSummary = () =>
  client.get('/transactions/summary').then((res) => res.data);

export const createTransaction = (payload) =>
  client.post('/transactions', payload).then((res) => res.data);

export const updateTransaction = (id, payload) =>
  client.put(`/transactions/${id}`, payload).then((res) => res.data);

export const deleteTransaction = (id) =>
  client.delete(`/transactions/${id}`).then((res) => res.data);
