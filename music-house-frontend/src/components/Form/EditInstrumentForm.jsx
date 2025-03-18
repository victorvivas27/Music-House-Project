import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import InstrumentForm from './InstrumentForm'
import { getInstrumentById, updateInstrument } from '../../api/instruments'

import {
  characteristicsToFormData,
  formDataToCharacteristics
} from '../utils/editInstrument'

import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '../../hook/useAlert'

const EditInstrumentForm = ({ id }) => {
  const [instrument, setInstrument] = useState(0)
  const [initialFormData, setInitialFormData] = useState()
  const [loading, setLoading] = useState(true)
 const navigate =useNavigate()
 const { showSuccess, showError } = useAlert()
 const [isSubmitting, setIsSubmitting] = useState(false)
 

const getInstrument = useCallback(() => {
    setLoading(true)
    getInstrumentById(id)
      .then(([instrument]) => {
        setInstrument(instrument)
      })
      .catch(() => {
        setInstrument({})
      })
  },[id])



  useEffect(() => {
    getInstrument()
  }, [getInstrument])

  useEffect(() => {
    if (!(instrument && instrument.data?.idInstrument)) return

    const data = {
      idInstrument: instrument.data.idInstrument || '',
      name: instrument.data.name || '',
      description: instrument.data.description || '',
      measures: instrument.data.measures || '',
      weight: instrument.data.weight || '',
      rentalPrice: instrument.data.rentalPrice || '',
      idCategory: instrument.data.category?.idCategory || '',
      idTheme: instrument.data.theme?.idTheme || '',
      characteristics: characteristicsToFormData(instrument),
    };
    setInitialFormData(data)
    setLoading(false)
  }, [instrument])





   // Enviar actualización del instrumento sin imágenes
   const onSubmit = async (formData) => {
    if (!formData) return

    const data = {
      ...formData,
      characteristic: formDataToCharacteristics(formData)
    }

    setIsSubmitting(true) // ✅ Activar el loader del botón inmediatamente

    try {
      await updateInstrument(data)

      setTimeout(() => {
        showSuccess('Instrumento actualizado correctamente.') // ✅ Mostrar éxito después de 2s
      }, 2000)

      setTimeout(() => {
        navigate('/instruments') // ✅ Redirigir después de 4s
      }, 2000)
    } catch (error) {
      showError('No se pudo actualizar el instrumento.')
    } finally {
      setTimeout(() => {
        setIsSubmitting(false) // ✅ Apagar el loader después de 4s
      }, 2000)
    }
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
        <InstrumentForm
         initialFormData={initialFormData} 
         onSubmit={onSubmit} 
         loading={isSubmitting} // ✅ Pasar estado al formulario
         isEditing={true}
         />
      )}
     
    </Box>
  )
}

export default EditInstrumentForm

 EditInstrumentForm.propTypes={
  id:PropTypes.string.isRequired,
  onSaved:PropTypes.func
 }