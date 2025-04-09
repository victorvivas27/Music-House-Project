import { useEffect, useRef, useState } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

import { useNavigate, Link } from 'react-router-dom'
import '../components/styles/transitions.css'

import { Logo } from '@/components/Images/Logo'
import Login from '@/components/Form/usuario/Login'
import NewUser from '@/components/Form/usuario/NewUser'
import { BoxFormUnder, BoxLogoSuperior, ContainerLogo, MainCrearUsuario } from '@/components/styles/ResponsiveComponents'

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