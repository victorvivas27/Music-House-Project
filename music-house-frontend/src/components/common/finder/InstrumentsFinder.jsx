import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Close from '@mui/icons-material/Close'
import { IconButton } from '@mui/material'
import { searchInstrumentsByName } from '../../../api/instruments'
import { Code } from '../../../api/constants'
import { useAppStates } from '../../utils/global.context'
import { actions } from '../../utils/actions'
import { InputFinder } from './InputFinder'

import { ButtonFinder } from './ButtonFinder'
import dayjs from 'dayjs'


export const Finder = () => {
  const [searchPattern, setSearchPattern] = useState()
  const [sendPattern, setSendPattern] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [showSugests, setShowSugests] = useState(false)
  const [found, setFound] = useState(false)
  const [dateFrom, setDateFrom] = useState(null)
  
  const inputFinderRef = useRef()
  const suggestsLeft = inputFinderRef.current?.getBoundingClientRect().left
  const suggestsTop = `${inputFinderRef.current?.getBoundingClientRect().top + inputFinderRef.current?.getBoundingClientRect().height + 8}px`
  const suggestWidth = inputFinderRef.current?.getBoundingClientRect().width
  const [instruments, instrumentsSearchCode] =
    searchInstrumentsByName(searchPattern)

  

  

 

  

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
  }

  const handleSubmitSearch = () => {
    setSendPattern(true)
  }

  const clearFinder = () => {
    setSearchPattern('')
    setDateFrom(null)
    
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
          onClose={() => clearFinder()}
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
            width: { xs: suggestWidth, md: '60%' },
            borderRadius: '5px',
            boxShadow: '5px 5px 10px rgba(0,0,0,0.5);',
            position: 'fixed',
            left: suggestsLeft,
            top: suggestsTop
          }}
        >
          <Box sx={{ position: 'relative', '& svg': { height: '1.5rem' } }}>
            <IconButton
              sx={{ position: 'absolute', right: 3, top: 3, zIndex: 1300 }}
              onClick={() => setShowSugests(false)}
            >
              <Close />
            </IconButton>
          </Box>
          <List>
            {instruments &&
              instruments.map((instrument, index) => (
                <ListItem
                  id={`instrument-name-${index}`}
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
