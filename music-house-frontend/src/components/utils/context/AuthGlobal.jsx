import React, { createContext, useContext, useState, useEffect } from 'react'
import { getIsAdmin, getIsUser } from '../roles/constants'

const AuthUserContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthUserContext)
}

export const AuthContextProvider = ({ loggedUser, children }) => {
  const [authGlobal, setAuthGlobal] = useState(!!loggedUser)
  const [user, setUser] = useState(loggedUser)
  const [isUserAdmin, setIsUserAdmin] = useState(getIsAdmin(loggedUser?.roles))
  const [isUser, setIsUser] = useState(getIsUser(loggedUser?.roles))

  const toggleAuthGlobal = (isAuth) => {
    setAuthGlobal(isAuth)
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
        isUser
      }}
    >
      {children}
    </AuthUserContext.Provider>
  )
}
