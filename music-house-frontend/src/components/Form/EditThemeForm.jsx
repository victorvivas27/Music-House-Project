import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { getThemeById, updateTheme } from '../../api/theme'
import { MessageDialog } from '../common/MessageDialog'
import { Loader } from '../common/loader/Loader'
import { ThemeForm } from './ThemeForm'
import PropTypes from 'prop-types'

export const EditThemeForm = ({ id, onSaved }) => {
  const [theme, setTheme] = useState()
  const [initialFormData, setInitialFormData] = useState()
  const [loading, setLoading] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()

  

  const getTheme = useCallback(() => {
    setLoading(true)
    getThemeById(id)
      .then(([theme]) => {
        setTheme(theme)
      })
      .catch(() => {
        setTheme({})
      })
  },[id])

  useEffect(() => {
    getTheme()
  }, [getTheme])

  useEffect(() => {
    console.log("Datos obtenidos del tema:", theme);
    if (!(theme && theme.data?.idTheme)) return

    const data = {
      idTheme: theme.data.idTheme,
      themeName: theme.data.themeName,
      description: theme.data.description
    }
    setInitialFormData(data)
    setLoading(false)
  }, [theme])

  const onClose = () => {
    setShowMessage(false)
    if (typeof onSaved === 'function') onSaved()
  }

  const onSubmit = (formData) => {
    if (!formData) return

    updateTheme(formData)
      .then(() => {
        setMessage('Thematica guardada exitosamente')
      })
      .catch(() => {
        setMessage('No se pudo guardar la tematica')
      })
      .finally(() => {
        setShowMessage(true)
         // Cerrar la ventana emergente automáticamente después de 3 segundos
         setTimeout(() => {
          setShowMessage(false);
        }, 2000);
      })
  }

  if (loading) {
    return <Loader title="Un momento por favor" />
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {!loading && (
        <ThemeForm initialFormData={initialFormData} onSubmit={onSubmit} />
      )}
      <MessageDialog
        title="Editar Tematica"
        message={message}
        isOpen={showMessage}
        buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </Box>
  )
}

EditThemeForm.propTypes = {
  id: PropTypes.string.isRequired, 
  onSaved: PropTypes.func, 
};
