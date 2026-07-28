import client from './client';

export const login = (email, password, role) =>
  client.post('/auth/login', { email, password, role }).then((res) => res.data);

export const register = (name, email, password, role) =>
  client.post('/auth/register', { name, email, password, role }).then((res) => res.data);

export const getProfile = () =>
  client.get('/auth/profile').then((res) => res.data);
