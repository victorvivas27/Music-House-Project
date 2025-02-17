import React, { createContext, useContext, useState, useMemo } from 'react'

const HeaderVisibilityContext = createContext()

// Agregar un displayName para mejorar la depuración
HeaderVisibilityContext.displayName = "HeaderVisibilityContext"

export const useHeaderVisibility = () => {
  return useContext(HeaderVisibilityContext)
}

export const HeaderVisibilityProvider = ({ children }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  const toggleHeaderVisibility = (isVisible) => {
    setIsHeaderVisible(prev => isVisible ?? !prev) // Permite alternar si no se pasa un valor
  }

  // Memoizar el valor del contexto para evitar renders innecesarios
  const contextValue = useMemo(() => ({
    isHeaderVisible,
    toggleHeaderVisibility
  }), [isHeaderVisible])

  return (
    <HeaderVisibilityContext.Provider value={contextValue}>
      {children}
    </HeaderVisibilityContext.Provider>
  )
}
