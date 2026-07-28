import client from './client';

export const getUsers = () =>
  client.get('/users').then((res) => res.data);

export const getUserDirectory = () =>
  client.get('/users/directory').then((res) => res.data);

export const createUser = (payload) =>
  client.post('/users', payload).then((res) => res.data);

export const updateUser = (id, payload) =>
  client.put(`/users/${id}`, payload).then((res) => res.data);

export const deleteUser = (id) =>
  client.delete(`/users/${id}`).then((res) => res.data);
