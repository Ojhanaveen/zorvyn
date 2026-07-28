import client from './client';

export const getAllSplits = () =>
  client.get('/splits').then((res) => res.data);

export const getMySplits = () =>
  client.get('/splits/mine').then((res) => res.data);

export const createSplit = (payload) =>
  client.post('/splits', payload).then((res) => res.data);

export const settleShare = (id, participantUserId) =>
  client.put(`/splits/${id}/settle`, participantUserId ? { participantUserId } : {}).then((res) => res.data);
