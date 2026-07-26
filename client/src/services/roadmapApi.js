import api from './api';

export const createRoadmap = async (formData) => {
  const res = await api.post('/roadmaps', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const listRoadmaps = async () => {
  const res = await api.get('/roadmaps');
  return res.data;
};

export const getRoadmap = async (id) => {
  const res = await api.get(`/roadmaps/${id}`);
  return res.data;
};

export const updateProgress = async (id, stepId, completed) => {
  const res = await api.patch(`/roadmaps/${id}/progress`, { stepId, completed });
  return res.data;
};

export const deleteRoadmap = async (id) => {
  const res = await api.delete(`/roadmaps/${id}`);
  return res.data;
};