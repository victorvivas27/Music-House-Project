import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import { getThemeById, updateTheme } from '../../api/theme'
import { MessageDialog } from '../common/MessageDialog'
import { Loader } from '../common/loader/Loader'
import { ThemeForm } from './ThemeForm'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export const EditThemeForm = ({ id, onSaved }) => {
  const [theme, setTheme] = useState()
  const [initialFormData, setInitialFormData] = useState()
  const [loading, setLoading] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const navigate =useNavigate()

  

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
    if (!formData) return;
  
    updateTheme(formData)
      .then(() => {
        setMessage("Temática guardada exitosamente");
        setShowMessage(true);
  
        // Evitar que el formulario se vacíe antes de navegar
        setTimeout(() => {
          navigate("/theme");
        }, 1000);
      })
      .catch(() => {
        setMessage("No se pudo guardar la temática");
        setShowMessage(true);
      });
  };

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
        //buttonText="Ok"
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
