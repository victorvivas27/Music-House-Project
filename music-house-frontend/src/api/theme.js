import { getFetch, postFetch, putFetch, deleteFetch } from '../helpers/useFetch'

//const URL_CATEGORIES = 'https://music-house.up.railway.app/api/category'
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getTheme = () => {
  return getFetch(`${BASE_URL}/theme/all`)
}

export const getThemeById = (idTheme) => {
  return getFetch(`${BASE_URL}/theme/search/${idTheme}`)
}

export const createTheme = ({ themeName, description }) => {
  return postFetch(`${BASE_URL}/theme/create`, { themeName, description })
}

export const updateTheme = ({ idTheme, themeName, description }) => {
  console.log("Enviando datos a la API:", { idTheme, themeName, description });
  return putFetch(`${BASE_URL}/theme/update`, {
    idTheme,
    themeName,
    description
  })
}

export const deleteTheme = (idTheme) => {
  console.log("Intentando eliminar el ID:", idTheme);
  return deleteFetch(`${BASE_URL}/theme/delete/${idTheme}`)
}
