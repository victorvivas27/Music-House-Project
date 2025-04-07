import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getTheme = async (page=0,size=5,sort="themeName,asc") => {
  try {
    const response = await axios
    .get(`${BASE_URL}/themes?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getThemeById = async (idTheme) => {
  try {
    const response = await axios
    .get(`${BASE_URL}/themes/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createTheme = async (formData) => {
  try {
    const response = await axios
    .post(`${BASE_URL}/themes`,formData ,{
      headers:{
        'Content-Type': 'multipart/form-data',
      }
     
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const updateTheme = async ({ idTheme, themeName, description }) => {
  try {
    const response = await axios
    .put(`${BASE_URL}/themes`, {
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
    const response = await axios
    .delete(`${BASE_URL}/themes/${idTheme}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const searchThemeName = 
async (name="", page = 0, size = 5, sort = "themeName,asc") => {
  try {
    const response = await axios
    .get(`${BASE_URL}/themes/search?name=${name}&page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};