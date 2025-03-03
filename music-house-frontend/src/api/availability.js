import axios from 'axios';

//const BASE_URL = 'https://music-house.up.railway.app/api'; // Puedes descomentar esta línea si no estás utilizando Vite
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Función para obtener la disponibilidad de un instrumento en un rango de fechas
export const getInstrumentAvailability = async (idInstrument, startDate, endDate) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${startDate}/between/${endDate}/${idInstrument}`
    );
    return response.data.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return []; // Si no hay disponibilidad, devolvemos un array vacío
    }
    throw new Error('Error al obtener la disponibilidad del instrumento');
  }
};

// Función para obtener todas las fechas disponibles para un instrumento específico
export const getAllAvailableDatesByInstrument = async (idInstrument) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/available-dates/find/all/${idInstrument}/instrument`
    );
    return response.data.data; // Devuelve la lista de fechas disponibles
  } catch (error) {
    if (error?.response?.status === 404) {
      return []; // Si no hay fechas disponibles, devolvemos un array vacío
    }
    throw new Error('Error al obtener las fechas disponibles para el instrumento');
  }
};

// Función para agregar fechas disponibles para un instrumento
export const addAvailableDates = async (availableDates) => {
  try {
    const response = await axios.post(`${BASE_URL}/available-dates/add`, availableDates);
    return response.data;
  } catch (error) {
    throw new Error('Error al agregar fechas disponibles');
  }
};

// Función para eliminar una fecha de disponibilidad
export const removeAvailableDate = async (idInstrument, idDate) => {
  try {
    await axios.delete(`${BASE_URL}/available-dates/delete/${idInstrument}/${idDate}`);
    return true;
  } catch (error) {
    throw new Error('Error al eliminar la fecha de disponibilidad');
  }
};

