import client from './client';

export const getBills = () =>
  client.get('/bills').then((res) => res.data);

export const getUpcomingBills = (days = 7) =>
  client.get(`/bills/upcoming?days=${days}`).then((res) => res.data);

export const createBill = (payload) =>
  client.post('/bills', payload).then((res) => res.data);

export const updateBill = (id, payload) =>
  client.put(`/bills/${id}`, payload).then((res) => res.data);

export const deleteBill = (id) =>
  client.delete(`/bills/${id}`).then((res) => res.data);

export const payBill = (id) =>
  client.put(`/bills/${id}/pay`).then((res) => res.data);
