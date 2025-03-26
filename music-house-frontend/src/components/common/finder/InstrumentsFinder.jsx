import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { searchInstrumentsByName } from '../../../api/instruments'
import { InputFinder } from './InputFinder'
//import { ButtonFinder } from './ButtonFinder'
import { Link, useLocation } from 'react-router-dom'
import Draggable from 'react-draggable'


export const Finder = () => {
  const [searchPattern, setSearchPattern] = useState('')
  const [showSugests, setShowSugests] = useState(false)
  const [found, setFound] = useState(false)
  const [instruments, setInstruments] = useState([])
  const inputRef = useRef()
  const [position, setPosition] = useState({
    left: 100,
    top: 100,
    width: '100%'
  })

  // 🧠 Actualizar posición cuando cambia input
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setPosition({
        left: rect.left,
        top: rect.top + rect.height + 8,
        width: rect.width
      })
    }
  }, [searchPattern])

  // 🔍 Buscar en tiempo real con debounce
  useEffect(() => {
    const fetchInstruments = async () => {
      if (searchPattern.trim() === '') {
        setInstruments([])
        setShowSugests(false)
        return
      }

      try {
        const response = await searchInstrumentsByName(searchPattern)
        setInstruments(response.result)
        setFound(response.result.length > 0)
        setShowSugests(true)
      } catch (error) {
        setInstruments([])
        setFound(false)
        setShowSugests(false)
      }
    }

    const delayDebounce = setTimeout(() => {
      fetchInstruments()
    }, 300)

    return () => clearTimeout(delayDebounce)
  }, [searchPattern])

  const handleKeyUp = (keyCode) => {
    if (keyCode === 27) {
      clearFinder()
    }
  }

  const handleKeyDown = (keyCode) => {
    if (keyCode === 9) setShowSugests(false)
  }

  /*const handleSubmitSearch = () => {
    if (!searchPattern.trim()) return
    setSearchPattern((prev) => prev + ' ') // Forzar cambio y que dispare el useEffect
  }*/

  const clearFinder = () => {
    setSearchPattern('')
    setInstruments([])
    setShowSugests(false)
  }
  const location = useLocation()

useEffect(() => {
  // Si el usuario se va del home, ocultar el desplegable
  if (location.pathname !== '/') {
    setSearchPattern('')
    setInstruments([])
    setShowSugests(false)
  }
}, [location.pathname])

  return (
    <Box
      sx={{
        padding: '.5rem',
        display: 'flex',
        gap: 2,
        justifyContent: { md: 'center' },
        alignItems: { md: 'center' },
        width: '100%',
        
      }}
    >
      <InputFinder
        label="Encuentra tu instrumento favorito"
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        value={searchPattern}
        setValue={setSearchPattern}
        inputRef={inputRef}
        onClose={clearFinder}
      />

      {/*<ButtonFinder
        variant="contained"
        onClick={handleSubmitSearch}
        disabled={!searchPattern}
      >
        Buscar
      </ButtonFinder>*/}

      {showSugests && found && (
        <Draggable handle=".drag-header">
          <Box
            sx={{
              position: 'fixed',
              left: position.left,
              top: position.top,
              width: position.width,
              backgroundColor: 'white',
              borderRadius: '5px',
              boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',
              zIndex: 1300,
              cursor: 'pointer'
            }}
            className="drag-header"
          >
            <Box
              sx={{
                display: 'flex',
                flexFlow: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: '#f7f7f7',
                borderBottom: '1px solid #ccc',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px'
              }}
            >
              <strong style={{ fontSize: '0.95rem' }}>Resultados de búsqueda</strong>
              <IconButton
                sx={{
                  width: 30,
                  height: 30
                }}
                size="small"
                onClick={() => setShowSugests(false)}
              >
                <Close
                  sx={{
                    fontSize: 22,
                    color: 'var(--color-error)'
                  }}
                />
              </IconButton>
            </Box>

            <List>
              {instruments.map((instrument, index) => (
                <ListItem
                  key={instrument.idInstrument || index}
                  sx={{
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    },
                    px: 2,
                    py: 1
                  }}
                >
                  <Link
                    to={`/instrument/${instrument.idInstrument}`}
                    style={{
                      textDecoration: 'none',
                      width: '100%',
                      display: 'block',
                      color: '#333',
                      fontWeight: 500
                    }}
                  >
                    <ListItemText
                      primary={instrument.name}
                      primaryTypographyProps={{
                        fontSize: '0.95rem'
                      }}
                    />
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Draggable>
      )}
    </Box>
  )
}
