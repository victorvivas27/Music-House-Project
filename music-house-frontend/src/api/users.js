import {
  getFetch,
  postFetch,
  deleteFetch
} from '../helpers/useFetch';
import axios from 'axios';

//const BASE_URL = "http://localhost:8080/api"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  // ✅ MODIFICADO: Ahora usa `axios.post()` en lugar de `postFetch`
  registerUser: async (formData) => {
    try {
      const response = await axios.post(URL_CREATE_USER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {

      throw new Error("Error al registrar usuario", error);
    }
  },
  updateUser: async (formData) => {
    try {
      const response = await axios.put(URL_UPDATE_USER, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al modificar usuario", error);
    }
  },

  deleteUser: (idUser) => deleteFetch(`${URL_DELETE_USER}/${idUser}`),

  addUserRole: (idUser, rol) =>
    postFetch(URL_ADD_ROLE_USER, { idUser, rol }),

  deleteUserRole: (idUser, rol) =>
    deleteFetch(URL_DELETE_ROLE_USER, { idUser, rol }),

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
      if (error.response) {
        // ⚠️ Si el backend responde con un error (ejemplo: 404, 401, 500)
        throw error.response; // ✅ Reenvía el error con los detalles del backend
      } else if (error.request) {
        // ⚠️ La solicitud se hizo pero no hubo respuesta del servidor
        throw new Error('No se pudo conectar con el servidor');
      } else {
        // ❌ Error inesperado (ejemplo: problema con axios)
        throw new Error(`Error inesperado: ${error.message}`);
      }
    }
  }
};