
import { createContext, useContext, useEffect, useState } from 'react'
import { getIsAdmin, getIsUser } from '../roles/constants'
import PropTypes from 'prop-types'

const AuthUserContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthUserContext)
}

export const AuthContextProvider = ({ loggedUser, children }) => {
  const [authGlobal, setAuthGlobal] = useState(!!loggedUser)
  const [user, setUser] = useState(loggedUser || null)
  const [isUserAdmin, setIsUserAdmin] = useState(getIsAdmin(loggedUser?.roles))
  const [isUser, setIsUser] = useState(getIsUser(loggedUser?.roles))

  const setAuthData = (userData) => {
    if (!userData || !userData.token) {
      console.error('Error: Datos de usuario inválidos')
      return
    }

    localStorage.setItem('token', userData.token)
    setUser(userData)
    setAuthGlobal(true)
    setIsUserAdmin(getIsAdmin(userData.roles))
    setIsUser(getIsUser(userData.roles))
  }

  useEffect(() => {
    setIsUserAdmin(getIsAdmin(user?.roles))
    setIsUser(getIsUser(user?.roles))
  }, [user])

  return (
    <AuthUserContext.Provider
      value={{
        authGlobal,
        setAuthGlobal,
        user,
        setUser,
        isUserAdmin,
        isUser,
        setAuthData
      }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}

// 🟢 Validación de PropTypes
AuthContextProvider.propTypes = {
  loggedUser: PropTypes.shape({
    name: PropTypes.string,
    lastName: PropTypes.string,
    roles: PropTypes.arrayOf(
      PropTypes.shape({
        idRol: PropTypes.number,
        rol: PropTypes.string,
        registDate: PropTypes.string
      })
    ),
    token: PropTypes.string
  }),
  children: PropTypes.node.isRequired
}

export default AuthContextProvider
