import api from './api';

export const getListings = () => api.get('/listings');
export const createListing = (data) => api.post('/listings', data);
