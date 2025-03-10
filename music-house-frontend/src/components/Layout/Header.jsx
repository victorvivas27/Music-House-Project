import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import { Divider } from '@mui/material'
import { Finder } from '../common/finder/InstrumentsFinder'

import { HeaderWrapper } from './HeaderWrapper'
import {
  UpperStyledToolbar,
  MiddleStyledToolbar,
  LowerStyledToolbar
} from './StyledToolbar'
import { Logo } from '../Images/Logo'
import { LogoWrapper } from './LogoWrapper'
import { MenuWrapper, MenuUserWrapper } from './MenuWrapper'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../utils/context/AuthGlobal'
import { useHeaderVisibility } from '../utils/context/HeaderVisibilityGlobal'

import '../styles/header.styles.css'
import background from '../../assets/background.svg'

const pagesMobile = [
  { to: '/', text: 'Inicio', any: true },
  { to: '/about', text: 'Acerca de', anonymous: true, user: true },
  { to: '/favorites', text: 'Favoritos', user: true },
  { to: '/reservations', text: 'Mis reservas', user: true }
]

const pagesDesktop = [
  { to: '/', text: 'Inicio', any: true },
  { to: '/instruments', text: 'Instrumentos', admin: true },
  { to: '/usuarios', text: 'Usuarios', admin: true },
  { to: '/categories', text: 'Categorías', admin: true },
  { to: '/theme', text: 'Tematica', admin: true },
  { to: '/about', text: 'Acerca de', anonymous: true, user: true },
  { to: '/favorites', text: 'Favoritos', user: true },
  { to: '/reservations', text: 'Mis reservas', user: true }
]

export const Header = () => {
  const [prevScroll, setPrevScroll] = useState(0)
  const [visible, setVisible] = useState(true)
  const [isMenuOpen, setIsMenuopen] = useState(false)
  const [isMenuUserOpen, setIsMenuUserOpen] = useState(false)
  const [anchorElNav, setAnchorElNav] = useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const {
    authGlobal,
    logOut,
    idUser,
    isUserAdmin,
    isUser,
    userName,
    userLastName
  } = useAuthContext()
  const { toggleHeaderVisibility } = useHeaderVisibility()
  const { pathname } = useLocation()
  const [userMenuTimeout, setUserMenuTimeout] = useState(null)
  const [menuTimeout, setMenuTimeout] = useState(null)
  const isHome = pathname === '/'
  const navigate = useNavigate()

  const navigationTo = (location) => {
    navigate(location)
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
    setIsMenuopen(true)

    // 🔄 Reinicia el temporizador cada vez que se abre el menú
    clearTimeout(menuTimeout)
    const timeout = setTimeout(() => {
      setIsMenuopen(false)
      setAnchorElNav(null)
    }, 3000) // ⏳ Cierra después de 5 segundos de inactividad
    setMenuTimeout(timeout)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
    setIsMenuUserOpen(true)

    // 🔄 Reinicia el temporizador cada vez que se abre el menú
    clearTimeout(userMenuTimeout)
    const timeout = setTimeout(() => {
      setIsMenuUserOpen(false)
      setAnchorElUser(null)
    }, 3000) // ⏳ Cierra después de 5 segundos de inactividad
    setUserMenuTimeout(timeout)
  }

  const handleCloseNavMenu = () => {
    clearTimeout(menuTimeout) // 🔹 Cancela el cierre automático
    setIsMenuopen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      const isHeaderVisible =
        (prevScroll > currentScroll && prevScroll - currentScroll > 70) ||
        currentScroll < 10
      setVisible(isHeaderVisible)
      toggleHeaderVisibility(isHeaderVisible)
      setPrevScroll(currentScroll)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScroll, toggleHeaderVisibility])

  const handleCloseUserMenu = () => {
    setIsMenuUserOpen(false)
    setAnchorElUser(null)
  }

  return (
    <HeaderWrapper
      isHome={isHome}
      backgroundImageUrl={background}
      sx={{ transition: 'top 1.2s', top: visible ? '0' : '-300px' }}
    >
      <Container maxWidth="xl">
        <UpperStyledToolbar disableGutters>
          <MenuWrapper>
            <IconButton
              size="large"
              aria-label="Menu navegación"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              {authGlobal ? (
                <Avatar
                  sx={{
                    height: '2rem !important',
                    width: '2rem !important'
                  }}
                >
                  {userName && userLastName
                    ? `${userName.charAt(0).toUpperCase()}${userLastName.charAt(0).toUpperCase()}`
                    : ''}
                </Avatar>
              ) : (
                <MenuIcon sx={{ fill: 'white' }} fontSize="large" />
              )}
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              anchorEl={anchorElNav}
              keepMounted
              open={isMenuOpen}
              sx={{
                display: { xs: 'block', md: 'none' },
                width: '10rem',
                height: '26rem'
              }}
              hideBackdrop
            >
              {pagesMobile.map((page, index) => {
                return (
                  ((page.user && isUser) ||
                    (page.admin && isUserAdmin) ||
                    (page.anonymous && !(isUser || isUserAdmin)) ||
                    page.any) && (
                    <MenuItem
                      key={`menu-nav-${index}`}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">
                        <Link to={page.to} className="option-link">
                          {page.text}
                        </Link>
                      </Typography>
                    </MenuItem>
                  )
                )
              })}

              {authGlobal ? (
                <Box>
                  <Divider
                    sx={{
                      width: '80%',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  />
                  <MenuItem
                    key={'menu-nav-user-profile'}
                    onClick={() => {
                      navigate(`/perfil/${idUser}`) // Luego navega a la página

                      handleCloseUserMenu() // Cierra el menú primero
                    }}
                  >
                    <Typography textAlign="center">Mi Perfil</Typography>
                  </MenuItem>
                  <MenuItem key={`menu-nav-close-session`} onClick={logOut}>
                    <Typography textAlign="center">Cerrar sesión</Typography>
                  </MenuItem>
                </Box>
              ) : (
                <Box>
                  <Divider
                    sx={{
                      width: '80%',
                      marginLeft: 'auto',
                      marginRight: 'auto'
                    }}
                  />
                  <MenuItem
                    key={`menu-nav-close-session`}
                    onClick={() => navigationTo('/autentificacion')}
                  >
                    <Typography textAlign="center">Iniciar sesión</Typography>
                  </MenuItem>
                </Box>
              )}
            </Menu>
          </MenuWrapper>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pagesDesktop.map((page, index) => {
              return [
                ((page.admin && isUserAdmin) ||
                  (page.user && isUser) ||
                  (page.anonymous && !(isUser || isUserAdmin)) ||
                  page.any) && (
                  <Button
                    key={`menu-option-${index}`}
                    sx={{
                      my: 2,
                      color: 'white',
                      display: 'block',
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      padding: '0 .6rem'
                    }}
                  >
                    <Link to={page.to} className="nav-link">
                      {page.text}
                    </Link>
                  </Button>
                )
              ]
            })}
          </Box>
          <Link to="/">
            <LogoWrapper variant="h5" noWrap>
              <Logo />
            </LogoWrapper>
          </Link>
        </UpperStyledToolbar>
        <MiddleStyledToolbar
          sx={{
            display: {
              xs: 'none',
              md: `${isHome ? 'flex' : 'none'}`
            }
          }}
        >
          <Box
            sx={{
              flexGrow: 0,
              padding: '.5rem',
              display: { xs: 'none', md: 'block' }
            }}
          >
            {authGlobal ? (
              <MenuUserWrapper>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenUserMenu}
                  color="inherit"
                >
                  <Tooltip title="Opciones">
                    <Chip
                      avatar={
                        <Avatar
                          sx={{
                            height: '2rem !important',
                            width: '2rem !important'
                          }}
                        >
                          {userName && userLastName
                            ? `${userName.charAt(0).toUpperCase()}${userLastName.charAt(0).toUpperCase()}`
                            : '...'}
                        </Avatar>
                      }
                      label={`Hola ${userName} ${userLastName}!`}
                      color="primary"
                      onClick={handleOpenUserMenu}
                      sx={{
                        borderRadius: '1rem',
                        height: '2.5rem'
                      }}
                    />
                  </Tooltip>
                </IconButton>
                <Menu
                  id="menu-appbar-user"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  anchorEl={anchorElUser}
                  keepMounted
                  open={isMenuUserOpen}
                  sx={{
                    display: { xs: 'none', md: 'block' },
                    width: '10rem',
                    height: '12rem',
                    right: '-3rem !important',
                    '& .MuiPopover-paper': {
                      left: `${anchorElUser?.getBoundingClientRect().x + 16}px !important`
                    }
                  }}
                  hideBackdrop
                >
                  <MenuItem
                    key={'menu-nav-user-profile'}
                    onClick={() => {
                      setIsMenuUserOpen(false) // Cerrar el menú de usuario
                      setAnchorElUser(null) // Reiniciar el ancla del menú
                      navigate(`/perfil/${idUser}`)
                    }}
                  >
                    <Typography textAlign="center">Mi Perfil</Typography>
                  </MenuItem>
                  <MenuItem key={`menu-nav-close-session`} onClick={logOut}>
                    <Typography textAlign="center">Cerrar sesión</Typography>
                  </MenuItem>
                </Menu>
              </MenuUserWrapper>
            ) : (
              <Tooltip title="Iniciar sesión">
                <Button
                  variant="contained"
                  sx={{ borderRadius: '.25rem', padding: '.5rem .5rem' }}
                  onClick={() => navigationTo('/autentificacion')}
                >
                  <Typography textAlign="center" sx={{ fontWeight: 'bold' }}>
                    Iniciar sesión
                  </Typography>
                </Button>
              </Tooltip>
            )}
          </Box>
        </MiddleStyledToolbar>
        <LowerStyledToolbar sx={{ display: `${isHome ? 'flex' : 'none'}` }}>
          <Finder />
        </LowerStyledToolbar>
      </Container>
    </HeaderWrapper>
  )
}
