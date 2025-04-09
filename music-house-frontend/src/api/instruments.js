import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getInstruments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/instruments/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getInstrumentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/instruments/search/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getThemes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createInstrument = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/instruments/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const updateInstrument = async (payload) => {
  try {
    const response = await axios.put(`${BASE_URL}/instruments/update`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const deleteInstrument = async (idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/instruments/delete/${idInstrument}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const searchInstrumentsByName = async (name) => {
  if (!name) return [];

  try {
    const response = await axios.get(`${BASE_URL}/instruments/find/name/${name}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
