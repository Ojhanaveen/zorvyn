import client from './client';

export const getGoals = () =>
  client.get('/goals').then((res) => res.data);

export const createGoal = (payload) =>
  client.post('/goals', payload).then((res) => res.data);

export const updateGoal = (id, payload) =>
  client.put(`/goals/${id}`, payload).then((res) => res.data);

export const deleteGoal = (id) =>
  client.delete(`/goals/${id}`).then((res) => res.data);

export const contributeToGoal = (id, amount) =>
  client.post(`/goals/${id}/contribute`, { amount }).then((res) => res.data);
