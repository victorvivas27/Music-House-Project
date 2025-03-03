
import axios from 'axios';
//const URL_RESERVATIONS = 'https://music-house.up.railway.app/api/reservations'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getReservations= async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reservations/all`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las reservas');
    }
  }

  export const getReservationById= async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/reservations/search/user/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la reserva');
    }
  }

  export const deleteReservation =async (idInstrument, idUser, idReservation) => {
    try {
      await axios.delete(`${BASE_URL}/reservations/delete/${idInstrument}/${idUser}/${idReservation}`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar la reserva');
    }
  }


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
    if (error?.response?.status === 400) {
      throw new Error(error.response.data.message || 'Error en la solicitud');
    }
    throw new Error('Error al crear la reserva');
  }
};
