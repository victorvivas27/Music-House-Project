import PropTypes from 'prop-types'
import  { createContext, useContext, useState, useMemo } from 'react'

const HeaderVisibilityContext = createContext()
HeaderVisibilityContext.displayName = "HeaderVisibilityContext"

export const useHeaderVisibility = () => {
  return useContext(HeaderVisibilityContext)
}

export const HeaderVisibilityProvider = ({ children }) => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)

  const toggleHeaderVisibility = (isVisible) => {
    setIsHeaderVisible(prev => isVisible ?? !prev) 
  }
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
HeaderVisibilityProvider.propTypes={
  children:PropTypes.node
}