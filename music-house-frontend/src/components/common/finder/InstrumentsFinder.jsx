import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { searchInstrumentsByName } from '../../../api/instruments'
import { InputFinder } from './InputFinder'
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

  const clearFinder = () => {
    setSearchPattern('')
    setInstruments([])
    setShowSugests(false)
  }
  const location = useLocation()

  useEffect(() => {
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
        width: '100%'
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
      {showSugests && found && (
        <Draggable handle=".drag-header">
          <Box
            sx={{
              position: 'fixed',
              left: position.left,
              top: position.top,
              width: position.width,
              backgroundColor: 'var( --color-secundario-80)',

              borderRadius: '5px',
              boxShadow: 'var(--box-shadow)',
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
                backgroundColor: 'var(--color-primario)',
                borderBottom: '1px solid #ccc',
                borderTopLeftRadius: '5px',
                borderTopRightRadius: '5px'
              }}
            >
              <strong style={{ fontSize: '0.95rem' }}>
                Resultados de búsqueda
              </strong>
              <IconButton
                sx={{
                  width: 30,
                  height: 30
                }}
                size="small"
                onClick={clearFinder}
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
                      backgroundColor: 'var(--color-secundario)'
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
                      color: 'var(--color-primario)',
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
