import axios from 'axios';
import { handleApiError } from './handleApiError';


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener todos los instrumentos
export const getInstruments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/instrument/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener un instrumento por ID
export const getInstrumentById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/instrument/search/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener todos los temas
export const getThemes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Crear un nuevo instrumento
export const createInstrument = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/instrument/create`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Actualizar un instrumento existente
export const updateInstrument = async (payload) => {
  try {
    const response = await axios.put(`${BASE_URL}/instrument/update`, payload);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar un instrumento por ID
export const deleteInstrument = async (idInstrument) => {
  try {
    const response = await axios.delete(`${BASE_URL}/instrument/delete/${idInstrument}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Buscar instrumentos por nombre
export const searchInstrumentsByName = async (name) => {
  if (!name) return [];

  try {
    const response = await axios.get(`${BASE_URL}/instrument/find/name/${name}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
