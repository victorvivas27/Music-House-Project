import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const updateAddress =
  async ({ idAddress, street, number, city, state, country }) => {
    try {
      const response = await axios
        .put(`${BASE_URL}/address`, {
          idAddress,
          street,
          number,
          city,
          state,
          country
        });
      return response.data;
    } catch (error) {
      handleApiError(error)
    }
  };

export const addAddress =
  async ({ idUser, street, number, city, state, country }) => {
    try {
      const response = await axios
        .post(`${BASE_URL}/address`, {
          idUser,
          street,
          number,
          city,
          state,
          country
        });
      return response.data;
    } catch (error) {
      handleApiError(error)
    }
  };

export const removeAddress =
  async (idAddress) => {
    try {
      const response = await axios
        .delete(`${BASE_URL}/address/${idAddress}`);
      return response.data;
    } catch (error) {
      handleApiError(error)
    }
  };
