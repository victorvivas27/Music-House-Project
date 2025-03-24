import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { searchInstrumentsByName } from '../../../api/instruments'
import { InputFinder } from './InputFinder'
import { ButtonFinder } from './ButtonFinder'


export const Finder = () => {
  const [searchPattern, setSearchPattern] = useState('')
  const [sendPattern, setSendPattern] = useState(false)
  const [showSugests, setShowSugests] = useState(false)
  const [found, setFound] = useState(false)
  const [instruments, setInstruments] = useState([])

  const inputFinderRef = useRef()
  const suggestsLeft = inputFinderRef.current?.getBoundingClientRect().left || 0
  const suggestsTop = inputFinderRef.current
    ? `${inputFinderRef.current.getBoundingClientRect().top + inputFinderRef.current.getBoundingClientRect().height + 8}px`
    : '100px'
  const suggestWidth = inputFinderRef.current?.getBoundingClientRect().width || '100%'

  // 🔍 Efecto para buscar instrumentos
  useEffect(() => {
    const fetchInstruments = async () => {
      if (sendPattern && searchPattern.trim() !== '') {
        try {
          const response = await searchInstrumentsByName(searchPattern)
          setInstruments(response.result)
          setFound(response.result.length > 0)
          setShowSugests(true)
        } catch (error) {
          setInstruments([])
          setFound(false)
          setShowSugests(false)
        } finally {
          setSendPattern(false)
        }
      }
    }

    fetchInstruments()
  }, [sendPattern, searchPattern])

  const handleKeyUp = (keyCode) => {
    if (keyCode === 27) {
      clearFinder()
      setSendPattern(true)
    }
  }

  const handleKeyDown = (keyCode) => {
    if (keyCode === 9) setShowSugests(false)
  }

  const handleSelected = (value) => {
    setSearchPattern(value)
    setShowSugests(false)
  }

  const handleSubmitSearch = () => {
    setSendPattern(true)
  }

  const clearFinder = () => {
    setSearchPattern('')
    setInstruments([])
    setShowSugests(false)
  }

  return (
    <Box
      sx={{
        padding: '.5rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: { md: 'center' },
        alignItems: { md: 'center' },
        width: '100%'
      }}
    >
      <Box
        sx={{
          padding: '.5rem',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          gap: { xs: '.5rem', md: '1rem' }
        }}
      >
        <InputFinder
          label="Encuentra tu instrumento favorito"
          onKeyUp={handleKeyUp}
          onKeyDown={handleKeyDown}
          value={searchPattern}
          setValue={setSearchPattern}
          inputRef={inputFinderRef}
          onClose={clearFinder}
        />

        <ButtonFinder
          variant="contained"
          onClick={handleSubmitSearch}
          disabled={!searchPattern}
        >
          Buscar
        </ButtonFinder>
      </Box>

      {showSugests && found && (
        <Box
          sx={{
            backgroundColor: 'white',
            width: { xs: suggestWidth},
            borderRadius: '5px',
            boxShadow: '5px 5px 10px rgba(0,0,0,0.5)',
            position: 'fixed',
            left: suggestsLeft,
            top: suggestsTop,
            zIndex: 1300,
            border:"1px solid red"
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <IconButton
              sx={{ 
                position: 'absolute', 
                right: 4,height:40, 
                border:"1px solid red"

              }}
              onClick={() => setShowSugests(false)}
            >
              <Close />
            </IconButton>
          </Box>
          <List>
            {instruments.map((instrument, index) => (
              <ListItem
                key={instrument.idInstrument || index}
                sx={{ cursor: 'pointer' }}
                onClick={() => handleSelected(instrument.name)}
              >
                <ListItemText primary={instrument.name} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}
