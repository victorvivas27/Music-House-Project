
import axios from 'axios';
//const URL_RESERVATIONS = 'https://music-house.up.railway.app/api/reservations'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getReservations= async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reservations/all`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw (error.response || "No se pudo conectar con el servidor");
      }
    }
  }

  export const getReservationById = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/reservations/search/user/${id}`);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw (error.response || "No se pudo conectar con el servidor");
      }
    }
};

  export const deleteReservation =async (idInstrument, idUser, idReservation) => {
    try {
     const response= await axios.delete(`${BASE_URL}/reservations/delete/${idInstrument}/${idUser}/${idReservation}`);
      return response.data 
    } catch (error) {
      if (error.response) {
        throw (error.response || "No se pudo conectar con el servidor");
      } 
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
    if (error.response) {
      throw (error.response || "No se pudo conectar con el servidor");
    }
  }
};
