import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const UsersApi = {

  getUsers: async (page=0,size=5,sort="name,asc") => {
    try {
      const response = await axios
      .get(`${BASE_URL}/users?page=${page}&size=${size}&sort=${sort}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },


  deleteUser: async (idUser) => {
    try {
      const response = await axios
      .delete(`${BASE_URL}/users/${idUser}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },


  getUserById: async (idUser) => {
    try {
      const response = await axios
      .get(`${BASE_URL}/users/${idUser}`);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },


  registerUser: async (formData) => {
    try {
      const response = await axios
      .post(`${BASE_URL}/users`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },


  loginUser: async (user) => {
    try {
      const response = await axios
      .post(`${BASE_URL}/users/login`, user);
      return response.data;
    } catch (error) {
      handleApiError(error);
    }
  },


  updateUser: async (formData) => {
    try {
      const response = await axios
      .put(`${BASE_URL}/users`, formData, {
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

export const searchUserName = 
async (name="", page = 0, size = 5, sort = "name,asc") => {
  try {
    const response = await axios
    .get(`${BASE_URL}/users/search?name=${name}&page=${page}&size=${size}&sort=${sort}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};