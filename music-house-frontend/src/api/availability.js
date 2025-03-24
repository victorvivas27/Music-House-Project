import axios from 'axios';
import { handleApiError } from './handleApiError';

//const BASE_URL = 'https://music-house.up.railway.app/api'; // Puedes descomentar esta línea si no estás utilizando Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Obtener disponibilidad de un instrumento en un rango de fechas
export const getInstrumentAvailability = async (idInstrument, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}/${idInstrument}`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Obtener todas las fechas disponibles por instrumento
export const getAllAvailableDatesByInstrument = async (idInstrument) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${idInstrument}/instrument`
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Agregar fechas disponibles
export const addAvailableDates = async (availableDates) => {
  try {
    const response = await axios.post(`${BASE_URL}/available-dates/add`, availableDates);
    return response.data; // 👈 importante que también uses `.result` si el backend responde igual
  } catch (error) {
    handleApiError(error);
  }
};

// Eliminar una fecha de disponibilidad
export const removeAvailableDate = async (idInstrument, idDate) => {
  try {
    const response = await axios.delete(`${BASE_URL}/available-dates/delete/${idInstrument}/${idDate}`);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

