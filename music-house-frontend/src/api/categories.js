import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getCategories = async (page = 0, size = 5, sort = 'categoryName,asc') => {
  try {
    const response = await axios.get( `${BASE_URL}/categories?page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getCategoryById = async (idCategory) => {
  try {
    const response = await axios.get(`${BASE_URL}/categories/search/${idCategory}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createCategory = async ({ categoryName, description }) => {
  try {
    const response = await axios.post(`${BASE_URL}/categories`, {
      categoryName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const updateCategory = async ({ idCategory, categoryName, description }) => {
  try {
    const response = await axios.put(`${BASE_URL}/categories`, {
      idCategory,
      categoryName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const deleteCategory = async (idCategory) => {
  try {
    const response = await axios.delete(`${BASE_URL}/categories/${idCategory}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
