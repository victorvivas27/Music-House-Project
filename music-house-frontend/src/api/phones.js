import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const updatePhone = async ({ idPhone, phoneNumber }) => {
  try {
    const response = await axios.put(`${BASE_URL}/phone/update`, {
      idPhone,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const addPhone = async ({ idUser, phoneNumber }) => {
  try {
    const response = await axios.post(`${BASE_URL}/phone/add`, {
      idUser,
      phoneNumber
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const removePhone = async (idPhone) => {
  try {
    const response = await axios.delete(`${BASE_URL}/phone/delete/${idPhone}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};