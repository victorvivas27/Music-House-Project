
import { createContext, useContext, useEffect, useState } from 'react'
//import { getIsAdmin, getIsUser } from '../roles/constants'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode';


const AuthUserContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthUserContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authGlobal, setAuthGlobal] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [idUser, setIdUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userLastName, setUserLastName] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  const setAuthData = (userData) => {
    const { token } = userData; // Solo extraemos el token

    //console.log("1)setAuthData - token recibido:", token); // Log del token recibido

    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token); // Decodificamos el token
        //console.log("2)setAuthData - token decodificado:", decoded); // Log del token decodificado

        const roles = decoded.roles || []; // Extraemos roles del token
        const userId = decoded.id || null;
        const name = decoded.name || null;
        const lastName = decoded.lastName || null;

        setAuthGlobal(true);
        setIsUserAdmin(roles.includes("ADMIN"));
        setIsUser(roles.includes("USER"));
        setIdUser(userId);
        setUserName(name);
        setUserLastName(lastName);
        setUserRoles(roles); // Guardamos los roles obtenidos del token

        //console.log("3)setAuthData - datos actualizados:", {roles, userId, name, lastName}); // Log de los datos actualizados
      } catch (error) {
        //console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
        setAuthGlobal(false);
        setIsUserAdmin(false);
        setIsUser(false);
        setIdUser(null);
        setUserName(null);
        setUserLastName(null);
        setUserRoles([]);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

   // console.log("4)useEffect - token desde localStorage:", token); // Log del token en localStorage

    if (token) {
      try {
        const decoded = jwtDecode(token);
        //console.log("5)useEffect - token decodificado:", decoded); // Log del token decodificado

        const roles = decoded.roles || [];
        const userId = decoded.id || null;
        const name = decoded.name || null;
        const lastName = decoded.lastName || null;

        setAuthGlobal(true);
        setIsUserAdmin(roles.includes("ADMIN"));
        setIsUser(roles.includes("USER"));
        setIdUser(userId);
        setUserName(name);
        setUserLastName(lastName);
        setUserRoles(roles);

        //console.log("6)useEffect - datos actualizados desde localStorage:", {roles, userId, name, lastName }); // Log de los datos actualizados desde localStorage
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("token");
        setAuthGlobal(false);
        setIsUserAdmin(false);
        setIsUser(false);
        setIdUser(null);
        setUserName(null);
        setUserLastName(null);
        setUserRoles([]);
      }
    } else {
      //console.log("7)useEffect - No hay token en localStorage"); // Log cuando no se encuentra el token
    }
  }, []);


  return (
    <AuthUserContext.Provider
      value={{
        authGlobal,
        setAuthGlobal,
        setAuthData, // Añadimos setAuthData aquí
        isUserAdmin,
        setIsUserAdmin,
        isUser,
        setIsUser,
        idUser,
        userName,
        userLastName,
        userRoles
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};