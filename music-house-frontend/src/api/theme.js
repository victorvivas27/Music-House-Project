import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getTheme = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getThemeById = async (idTheme) => {
  try {
    const response = await axios.get(`${BASE_URL}/theme/search/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createTheme = async ({ themeName, description }) => {
  try {
    const response = await axios.post(`${BASE_URL}/theme/create`, {
      themeName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const updateTheme = async ({ idTheme, themeName, description }) => {
  try {
    const response = await axios.put(`${BASE_URL}/theme/update`, {
      idTheme,
      themeName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const deleteTheme = async (idTheme) => {
  try {
    const response = await axios.delete(`${BASE_URL}/theme/delete/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
