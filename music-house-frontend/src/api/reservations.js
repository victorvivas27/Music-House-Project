
import axios from 'axios';
import { handleApiError } from './handleApiError';
//const URL_RESERVATIONS = 'https://music-house.up.railway.app/api/reservations'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


// Obtener todas las reservas
export const getReservations = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/reservations/all`);
    return response.data.result;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener reservas por ID de usuario
export const getReservationById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/reservations/search/user/${id}`);
    return response.data.result;
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar una reserva
export const deleteReservation = async (idInstrument, idUser, idReservation) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/reservations/delete/${idInstrument}/${idUser}/${idReservation}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Crear una nueva reserva
export const createReservation = async (idUser, idInstrument, startDate, endDate) => {
  try {
    const response = await axios.post(`${BASE_URL}/reservations/create`, {
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
