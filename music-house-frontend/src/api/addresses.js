import axios from 'axios';

import { handleApiError } from './handleApiError';

//const URL_ADDRESSES = 'https://music-house.up.railway.app/api/address'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const updateAddress = async ({ idAddress, street, number, city, state, country }) => {
  try {
    const response = await axios.put(`${BASE_URL}/address/update`, {
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

export const addAddress = async ({ idUser, street, number, city, state, country }) => {
  try {
    const response = await axios.post(`${BASE_URL}/address/add_address`, {
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

export const removeAddress = async (idAddress) => {
  try {
    const response = await axios.delete(`${BASE_URL}/address/delete/${idAddress}`);
    return response.data;
  } catch (error) {
   handleApiError(error)
  }
};
