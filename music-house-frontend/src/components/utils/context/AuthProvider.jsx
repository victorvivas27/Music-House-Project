import {useEffect, useState } from 'react'
//import { getIsAdmin, getIsUser } from '../roles/constants'
import PropTypes from 'prop-types'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './AuthContext'
import { ROLE_ADMIN, ROLE_USER } from '../roles/constants'
import { isTokenExpired } from '../jwt/isTokenExpired'



export const AuthProvider = ({ children }) => {
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

    if (token && !isTokenExpired(token)) {
      localStorage.setItem('token', token)
    
      try {
        const decoded = jwtDecode(token) // Decodificamos el token


        const roles = decoded.roles || [] // Extraemos roles del token
        const userId = decoded.id || null
        const name = decoded.name || null
        const lastName = decoded.lastName || null

     
       
        

        setAuthGlobal(true)
        setIsUserAdmin(roles.includes(ROLE_ADMIN))
        setIsUser(roles.includes(ROLE_USER))
        setIdUser(userId)
        setUserName(name)
        setUserLastName(lastName)
        setUserRoles(roles) 
      } catch (error) {
       
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
      localStorage.removeItem('token')
      setAuthGlobal(false)
      setIsUserAdmin(false)
      setIsUser(false)
      setIdUser(null)
      setUserName(null)
      setUserLastName(null)
      setUserRoles([])
  
      navigate('/', { replace: true }) 
    }

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token && !isTokenExpired(token)) {
      try {
        const decoded = jwtDecode(token)

        const roles = decoded.roles || []
        const userId = decoded.id || null
        const name = decoded.name || null
        const lastName = decoded.lastName || null

        setAuthGlobal(true)
        setIsUserAdmin(roles.includes(ROLE_ADMIN))
        setIsUser(roles.includes(ROLE_USER))
        setIdUser(userId)
        setUserName(name)
        setUserLastName(lastName)
        setUserRoles(roles)
      } catch (error) {
       
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
    <AuthContext.Provider
      value={{
        authGlobal,
        setAuthGlobal,
        setAuthData,
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
    </AuthContext.Provider>
  )
}


AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
}
