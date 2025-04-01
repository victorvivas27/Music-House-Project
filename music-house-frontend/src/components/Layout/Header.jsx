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
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
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
import { useHeaderVisibility } from '../utils/context/HeaderVisibilityGlobal'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'

import background from '../../assets/background.svg'
import { useAuth } from '../../hook/useAuth'
import { pagesDesktop, pagesMobile } from './NavBar'

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
  } = useAuth()
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

    clearTimeout(menuTimeout)
    const timeout = setTimeout(() => {
      setIsMenuopen(false)
      setAnchorElNav(null)
    }, 3000)
    setMenuTimeout(timeout)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
    setIsMenuUserOpen(true)

    clearTimeout(userMenuTimeout)
    const timeout = setTimeout(() => {
      setIsMenuUserOpen(false)
      setAnchorElUser(null)
    }, 3000)
    setUserMenuTimeout(timeout)
  }

  const handleCloseNavMenu = () => {
    clearTimeout(menuTimeout)
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
                    height: '3rem !important',
                    width: '3rem !important'
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

            {/* 🔽 Menú MOBILE - Hamburguesa */}
            <Menu
              id="menu-appbar"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              anchorEl={anchorElNav}
              keepMounted
              open={isMenuOpen}
              hideBackdrop
              sx={{
                '& .MuiPaper-root': {
                  width: '200px',
                  backgroundColor: 'var(--color-secundario-80)',
                  borderRadius: '1rem',
                  padding: '0.5rem',
                  boxShadow: 'var(--box-shadow)',
                  color: 'var(--color-primario)',
                  border: '1px solid var(--color-primario)'
                }
              }}
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
                      <Link
                        to={page.to}
                        className="option-link"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          textDecoration: 'none',
                          color: 'var(--color-primario)',
                          width: '100%'
                        }}
                      >
                        {page.icon}
                        <Typography textAlign="left" sx={{ fontWeight: 500 }}>
                          {page.text}
                        </Typography>
                      </Link>
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
                      navigate(`/perfil/${idUser}`)
                      handleCloseUserMenu()
                    }}
                  >
                    <AssignmentIndRoundedIcon
                      sx={{ marginRight: 1, fontSize: 20 }}
                    />
                    <Typography textAlign="center">Mi Perfil</Typography>
                  </MenuItem>

                  <MenuItem key={`menu-nav-close-session`} onClick={logOut}>
                    <LogoutRoundedIcon sx={{ marginRight: 1, fontSize: 20 }} />
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
                    <LoginRoundedIcon sx={{ marginRight: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Iniciar sesión</Typography>
                  </MenuItem>
                </Box>
              )}
            </Menu>

            {/* 🔽Fin Menú MOBILE - Hamburguesa */}
          </MenuWrapper>
          <Box
            sx={{
              flexGrow: 1,
              display: {
                xs: 'none',
                md: 'flex'
              },
              alignItems: 'center'
            }}
          >
            {pagesDesktop.map((page, index) => {
              const shouldShow =
                (page.admin && isUserAdmin) ||
                (page.user && isUser) ||
                (page.anonymous && !(isUser || isUserAdmin)) ||
                page.any
              const isActive = location.pathname === page.to
              return (
                shouldShow && (
                  <Button
                    key={`menu-option-${index}`}
                    sx={{
                      textTransform: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      border: isActive
                        ? '2px solid var(--color-exito)'
                        : '2px solid transparent',
                      backgroundColor: isActive
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      height: 50,
                      margin: 1
                    }}
                  >
                    <Link
                      to={page.to}
                      className="nav-link"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        textDecoration: 'none',
                        color: 'var(--color-primario)'
                      }}
                    >
                      {page.icon}
                      {page.text}
                    </Link>
                  </Button>
                )
              )
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
                  onClick={handleOpenUserMenu}
                  sx={{
                    p: 0,
                    height: '100%',
                    width: 'auto',
                    borderRadius: '1.5rem',
                    transition: 'box-shadow 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 0 8px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  <Tooltip title="Opciones" arrow>
                    <Chip
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: 'var(--color-secundario)!important',
                            color: 'var(--color-primario)!important',
                            height: '3rem !important',
                            width: '3rem !important',
                            fontSize: '1rem !important',
                            fontFamily: 'Roboto'
                          }}
                        >
                          {userName && userLastName
                            ? `${userName.charAt(0).toUpperCase()}${userLastName.charAt(0).toUpperCase()}`
                            : '...'}
                        </Avatar>
                      }
                      label={
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {`${userName} ${userLastName}`}
                        </Typography>
                      }
                      color="primary"
                      onClick={handleOpenUserMenu}
                      sx={{
                        borderRadius: '1.5rem',
                        height: '3rem',
                        px: 2,
                        bgcolor: 'var(--color-primario)',
                        border: '1px solid var(--color-primario)',
                        '&:hover': {
                          backgroundColor: 'var(--color-secundario)',
                          color: 'var(--color-primario)',
                          '& .MuiAvatar-root': {
                            bgcolor: 'var(--color-primario)!important',
                            color: 'var(--color-secundario)!important'
                          }
                        }
                      }}
                    />
                  </Tooltip>
                </IconButton>

                {/* 🔽 Menú USUARIO - Pantalla grande */}
                <Menu
                  id="menu-appbar-user"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  anchorEl={anchorElUser}
                  keepMounted
                  open={isMenuUserOpen}
                  hideBackdrop
                  sx={{
                    '& .MuiPaper-root': {
                      width: '200px',
                      backgroundColor: 'var(--color-secundario-80)!important',
                      borderRadius: '1rem',
                      padding: '0.5rem',
                      boxShadow: 'var(--box-shadow)!important',
                      color: 'var(--color-primario)',
                      border: '1px solid var(--color-primario)'
                    }
                  }}
                >
                  {/* 🔽Fin  Menú USUARIO - Pantalla grande */}

                  <MenuItem
                    key={'menu-nav-user-profile'}
                    onClick={() => {
                      setIsMenuUserOpen(false)
                      setAnchorElUser(null)
                      navigate(`/perfil/${idUser}`)
                    }}
                  >
                    <AssignmentIndRoundedIcon
                      sx={{ marginRight: 1, fontSize: 20 }}
                    />
                    <Typography textAlign="center">Mi Perfil</Typography>
                  </MenuItem>
                  <MenuItem key={`menu-nav-close-session`} onClick={logOut}>
                    <LogoutRoundedIcon sx={{ marginRight: 1, fontSize: 20 }} />
                    <Typography textAlign="center">Cerrar sesión</Typography>
                  </MenuItem>
                </Menu>
              </MenuUserWrapper>
            ) : (
              <Tooltip title="Iniciar sesión">
                <Button
                  variant="contained"
                  onClick={() => navigationTo('/autentificacion')}
                  sx={{
                    borderRadius: '.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2rem',
                      height: '2rem'
                    }}
                  >
                    <LoginRoundedIcon margin="1px" className="vibrate-2" />
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                  >
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
