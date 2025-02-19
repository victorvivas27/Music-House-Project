import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import InstrumentForm from './InstrumentForm'
import { getInstrumentById, updateInstrument } from '../../api/instruments'
import { addImage, removeImage } from '../../api/images'
import {
  characteristicsToFormData,
  formDataToCharacteristics
} from '../utils/editInstrument'
import { MessageDialog } from '../common/MessageDialog'
import { Loader } from '../common/loader/Loader'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

const EditInstrumentForm = ({ id, onSaved }) => {
  const [instrument, setInstrument] = useState(0)
  const [initialFormData, setInitialFormData] = useState()
  const [loading, setLoading] = useState(true)
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const imagesToUpdate = []
  const navigate =useNavigate()

  

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
      idInstrument: instrument.data.idInstrument,
      name: instrument.data.name,
      description: instrument.data.description,
      measures: instrument.data.measures,
      weight: instrument.data.weight,
      rentalPrice: instrument.data.rentalPrice,
      idCategory: instrument.data.category?.idCategory,
      idTheme: instrument.data.theme?.idTheme,
      imageUrlsText: instrument.data?.imageUrls
        .map((image) => image.imageUrl)
        .join('\n'),
      characteristics: characteristicsToFormData(instrument)
    }
    setInitialFormData(data)
    setLoading(false)
  }, [instrument])

  const onClose = () => {
    setShowMessage(false)
    if (typeof onSaved === 'function') onSaved()
      navigate(-1)
  }

  const isSameImages = (newImageUrls) => {
    const actualImageUrls = instrument.data?.imageUrls

    if (!(actualImageUrls instanceof Array && newImageUrls instanceof Array))
      return true

    if (actualImageUrls.length === newImageUrls.length) {
      const isSame = actualImageUrls.reduce(
        (accumulator, currentImage) =>
          (accumulator =
            accumulator && newImageUrls.includes(currentImage.imageUrl)),
        true
      )
      return isSame
    } else {
      return false
    }
  }

  const onSubmit = (formData) => {
    if (!formData) return

    const data = {
      ...formData,
      characteristic: formDataToCharacteristics(formData)
    }
    const isSame = isSameImages(formData.imageUrls)

    updateInstrument(data)
      .then(() => {
        if (!isSame) {
          const idInstrument = instrument.data?.idInstrument
          const actualImages = instrument.data?.imageUrls
          const newImages = formData.imageUrls
          const totalImagesToUpdate = actualImages.length + newImages.length

          newImages.forEach((image) => {
            addImage(idInstrument, image)
              .then(() => {
                imagesToUpdate.push('ok')
              })
              .catch(() => {
                imagesToUpdate.push('nok')
              })
              .finally(() => {
                if (imagesToUpdate.length === totalImagesToUpdate) {
                  if (imagesToUpdate.some((image) => image === 'nok')) {
                    setMessage(
                      'Se guardó el instrumento, pero algunas imágenes no pudieron ser actualizadas'
                    )
                  }
                  setShowMessage(true)
                  getInstrument()
                }
              })
          })

          actualImages.forEach((image) => {
            removeImage(image.idImage, idInstrument)
              .then(() => {
                imagesToUpdate.push('ok')
              })
              .catch(() => {
                imagesToUpdate.push('nok')
              })
              .finally(() => {
                if (imagesToUpdate.length === totalImagesToUpdate) {
                  if (imagesToUpdate.some((image) => image === 'nok')) {
                    setMessage(
                      'Se guardó el instrumento, pero algunas imágenes no pudieron ser actualizadas'
                    )
                  }
                  setShowMessage(true)
                  getInstrument()
                }
              })
          })
        }

        setMessage('Instrumento guardado exitosamente')
        setShowMessage()
         // 🚀 Cerrar automáticamente y volver atrás después de 2 segundos
         setTimeout(() => {
          setShowMessage(false)
          navigate("/instruments") // Volver a la página anterior
        }, 1000)
      })
      .catch(() => {
        setMessage('No se pudo guardar instrumento')
      })
      .finally(() => {
        if (isSame) setShowMessage(true)
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
        <InstrumentForm initialFormData={initialFormData} onSubmit={onSubmit} />
      )}
      <MessageDialog
        title="Editar Instrumento"
        message={message}
        isOpen={showMessage}
        //buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </Box>
  )
}

export default EditInstrumentForm

 EditInstrumentForm.propTypes={
  id:PropTypes.string.isRequired,
  onSaved:PropTypes.func
 }