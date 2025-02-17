import {
  getFetch,
  postFetch,
  putFetch,
  deleteFetch
} from '../helpers/useFetch';
import axios from 'axios';

//const BASE_URL = "http://localhost:8080/api"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* console.log("Variables de entorno disponibles en Vite:", import.meta.env);
console.log("BASE URL FINAL:", BASE_URL); */
 

// Definir las rutas usando la base dinámica
const URL_GET_USERS = `${BASE_URL}/user/all`;
const URL_GET_USER = `${BASE_URL}/user/search/`;
const URL_CREATE_USER = `${BASE_URL}/auth/create/user`;
const URL_UPDATE_USER = `${BASE_URL}/user/update`;
const URL_DELETE_USER = `${BASE_URL}/user/delete`;
const URL_BASE_LOGIN = `${BASE_URL}/auth/login`;
const URL_CREATE_ADMIN = `${BASE_URL}/auth/create/admin`;
const URL_ADD_ROLE_USER = `${BASE_URL}/roles/user/rol/add`;
const URL_DELETE_ROLE_USER = `${BASE_URL}/roles/user/rol/delete`;

export const UsersApi = {
  getAllUsers: () => getFetch(URL_GET_USERS),

  getUserById: (id) => getFetch(`${URL_GET_USER}${id}`),

  registerUser: (user) => postFetch(URL_CREATE_USER, user),

  updateUser: (user) => putFetch(URL_UPDATE_USER, user),

  deleteUser: (idUser) => deleteFetch(`${URL_DELETE_USER}/${idUser}`),

  addUserRole: (user, newRole) =>
    postFetch(URL_ADD_ROLE_USER, { idUser: user.idUser, rol: newRole }),

  deleteUserRole: (user, oldRole) =>
    deleteFetch(URL_DELETE_ROLE_USER, { idUser: user.idUser, rol: oldRole }),

  registerAdmin: async (adminUser) => {
    try {
      const respuesta = await axios.post(URL_CREATE_ADMIN, adminUser);
      return respuesta.data;
    } catch (error) {
      throw new Error('Error al crear usuario administrador', error);
    }
  },

  loginUser: async (user) => {
    try {
      const respuesta = await axios.post(URL_BASE_LOGIN, user);
      return respuesta.data;
    } catch (error) {
      throw new Error('Error de login', error);
    }
  }
};