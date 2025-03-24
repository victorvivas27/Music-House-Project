import axios from 'axios';
import { handleApiError } from './handleApiError';

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener todas las categorías
export const getCategories = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/category/all`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (idCategory) => {
  try {
    const response = await axios.get(`${BASE_URL}/category/search/${idCategory}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Crear una nueva categoría
export const createCategory = async ({ categoryName, description }) => {
  try {
    const response = await axios.post(`${BASE_URL}/category/create`, {
      categoryName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Actualizar una categoría existente
export const updateCategory = async ({ idCategory, categoryName, description }) => {
  try {
    const response = await axios.put(`${BASE_URL}/category/update`, {
      idCategory,
      categoryName,
      description
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar una categoría
export const deleteCategory = async (idCategory) => {
  try {
    const response = await axios.delete(`${BASE_URL}/category/delete/${idCategory}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
