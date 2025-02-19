
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
  const [userRoles, setUserRoles] = useState([]); // Nueva variable para almacenar roles del usuario

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
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
        setUserRoles(roles); // Guardamos los roles obtenidos del token

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
    }
  }, []);

  return (
    <AuthUserContext.Provider
      value={{
        authGlobal,
        setAuthGlobal,
        isUserAdmin,
        setIsUserAdmin,
        isUser,
        setIsUser,
        idUser,
        userName,
        userLastName,
        userRoles // Pasamos los roles
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};