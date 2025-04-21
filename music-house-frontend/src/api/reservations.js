
import axios from 'axios';
import { handleApiError } from './handleApiError';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;



export const getReservations = async () => {
  try {
    const response = await axios
    .get(`${BASE_URL}/reservations`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const getReservationById = async (id) => {
  try {
    const response = await axios
    .get(`${BASE_URL}/reservations/${id}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const deleteReservation = async (idInstrument, idUser, idReservation) => {
  try {
    const response = await axios
    .delete(`${BASE_URL}/reservations/${idInstrument}/${idUser}/${idReservation}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


export const createReservation = async (idUser, idInstrument, startDate, endDate) => {
  try {
    const response = await axios.post(`${BASE_URL}/reservations`, {
      idUser,
      idInstrument,
      startDate,
      endDate,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
