import { createContext, useContext, useEffect, useState } from 'react'
//import { getIsAdmin, getIsUser } from '../roles/constants'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const AuthUserContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthUserContext)
}

export const AuthContextProvider = ({ children }) => {
  const [authGlobal, setAuthGlobal] = useState(false)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [idUser, setIdUser] = useState(null)
  const [userName, setUserName] = useState(null)
  const [userLastName, setUserLastName] = useState(null)
  const [userRoles, setUserRoles] = useState([])
  const navigate = useNavigate()

  const setAuthData = (userData) => {
    const { token } = userData // Solo extraemos el token

    if (token) {
      localStorage.setItem('token', token)
      try {
        const decoded = jwtDecode(token) // Decodificamos el token

        const roles = decoded.roles || [] // Extraemos roles del token
        const userId = decoded.id || null
        const name = decoded.name || null
        const lastName = decoded.lastName || null

       
        

        setAuthGlobal(true)
        setIsUserAdmin(roles.includes('ADMIN'))
        setIsUser(roles.includes('USER'))
        setIdUser(userId)
        setUserName(name)
        setUserLastName(lastName)
        setUserRoles(roles) // Guardamos los roles obtenidos del token
      } catch (error) {
        //console.error("Error al decodificar el token:", error);
        localStorage.removeItem('token')
        setAuthGlobal(false)
        setIsUserAdmin(false)
        setIsUser(false)
        setIdUser(null)
        setUserName(null)
        setUserLastName(null)
        setUserRoles([])
      }
    }
  }

    // ✅ Función de Logout
    const logOut = () => {
      localStorage.removeItem('token') // 🔹 Eliminar token del almacenamiento
      setAuthGlobal(false)
      setIsUserAdmin(false)
      setIsUser(false)
      setIdUser(null)
      setUserName(null)
      setUserLastName(null)
      setUserRoles([])
  
      navigate('/', { replace: true }) // 🔹 Redirigir al usuario a la página de inicio
    }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      try {
        const decoded = jwtDecode(token)

        const roles = decoded.roles || []
        const userId = decoded.id || null
        const name = decoded.name || null
        const lastName = decoded.lastName || null

        setAuthGlobal(true)
        setIsUserAdmin(roles.includes('ADMIN'))
        setIsUser(roles.includes('USER'))
        setIdUser(userId)
        setUserName(name)
        setUserLastName(lastName)
        setUserRoles(roles)
      } catch (error) {
        console.error('Error al decodificar el token:', error)
        localStorage.removeItem('token')
        setAuthGlobal(false)
        setIsUserAdmin(false)
        setIsUser(false)
        setIdUser(null)
        setUserName(null)
        setUserLastName(null)
        setUserRoles([])
      }
    }
  }, [])

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
        userRoles,
        logOut
      }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired
}
