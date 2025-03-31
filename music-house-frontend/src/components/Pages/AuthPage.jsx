import { useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import Login from '../Form/formUsuario/Login'
import { MainCrearUsuario } from '../common/crearUsuario/MainCrearUsuario'
import BoxLogoSuperior from '../common/crearUsuario/BoxLogoSuperior'
import { Logo } from '../Images/Logo'
import NewUser from '../Form/formUsuario/NewUser'
import BoxFormUnder from '../common/crearUsuario/BoxFormUnder'
import { useNavigate, Link } from 'react-router-dom'

import '../styles/transitions.css'

import { ContainerLogo } from '../Form/formUsuario/CustomButton'

const AuthPage = () => {
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(true)
  const contentRef = useRef(null)
  const [contentHeight, setContentHeight] = useState(0)

  const handleSwitch = (e) => {
    e.preventDefault()
    setShowLogin(!showLogin)
  }

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight)
    }
  }, [showLogin])

  return (
    <MainCrearUsuario container>
      <BoxLogoSuperior>
        <Link to="/" onClick={() => navigate('/')}>
          <ContainerLogo>
            <Logo />
          </ContainerLogo>
        </Link>
      </BoxLogoSuperior>

      <BoxFormUnder
       
        sx={{
          height: contentHeight,
         
        }}
      >
        <TransitionGroup component={null}>
          <CSSTransition
            key={showLogin ? 'Login' : 'NewUser'}
            timeout={1000}
            classNames="fade"
            unmountOnExit
          >
            <div ref={contentRef}>
              {showLogin ? (
                <Login onSwitch={handleSwitch} />
              ) : (
                <NewUser onSwitch={handleSwitch} />
              )}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </BoxFormUnder>
    </MainCrearUsuario>
  )
}

export default AuthPage