import axios from 'axios';
import { handleApiError } from './handleApiError';

//const BASE_URL = "http://localhost:8080/api"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const UsersApi = {
  // Obtener todos los usuarios
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/all`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Eliminar un usuario por ID
  deleteUser: async (idUser) => {
    try {
      const response = await axios.delete(`${BASE_URL}/user/delete/${idUser}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Obtener usuario por ID
  getUserById: async (idUser) => {
    try {
      const response = await axios.get(`${BASE_URL}/user/search/${idUser}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Registrar nuevo usuario
  registerUser: async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/create/user`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Login de usuario
  loginUser: async (user) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, user);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },

  // Actualizar datos de usuario
  updateUser: async (formData) => {
    try {
      const response = await axios.put(`${BASE_URL}/user/update`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};