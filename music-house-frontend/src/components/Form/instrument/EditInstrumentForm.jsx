import { useState, useEffect, useCallback } from 'react'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import useAlert from '@/hook/useAlert'
import { getInstrumentById, updateInstrument } from '@/api/instruments'
import { characteristicsToFormData, formDataToCharacteristics } from '@/components/utils/editInstrument'
import { addImage } from '@/api/images'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import InstrumentForm from './InstrumentForm'


const EditInstrumentForm = ({ id }) => {
  const [instrument, setInstrument] = useState(null)
  const [initialFormData, setInitialFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { showSuccess, showError } = useAlert()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInstrument = useCallback(() => {
    setLoading(true)

    getInstrumentById(id)
      .then((response) => {
        setInstrument(response.result || null)
      })
      .catch(() => {
        setInstrument(null)
      })
  }, [id])

  useEffect(() => {
    getInstrument()
  }, [getInstrument])

  useEffect(() => {
    if (!instrument?.idInstrument) return

    const data = {
      idInstrument: instrument.idInstrument || '',
      name: instrument.name || '',
      description: instrument.description || '',
      measures: instrument.measures || '',
      weight: instrument.weight || '',
      rentalPrice: instrument.rentalPrice || '',
      idCategory: instrument.category?.idCategory || '',
      idTheme: instrument.theme?.idTheme || '',
      characteristics: characteristicsToFormData({ result: instrument })
    }
    setInitialFormData(data)
    setLoading(false)
  }, [instrument])

  const onSubmit = async (formData) => {
    if (!formData) return

    const data = {
      ...formData,
      characteristic: formDataToCharacteristics(formData)
    }

    setIsSubmitting(true)

    try {
      const response = await updateInstrument(data)

      if (response?.result) {
        if (formData.imageUrls && formData.imageUrls.length > 0) {
          const formDataImages = new FormData()

          formDataImages.append(
            'data',
            new Blob(
              [JSON.stringify({ idInstrument: formData.idInstrument })],
              { type: 'application/json' }
            )
          )

          formData.imageUrls.forEach((file) => {
            formDataImages.append('files', file)
          })

          await addImage(formDataImages)
        }

        setTimeout(() => {
          showSuccess(`✅ ${response.message}`)
          navigate('/instruments')
        }, 1100)
      } else {
        showError(response?.message)
      }
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
    } finally {
      setTimeout(() => setIsSubmitting(false), 1100)
    }
  }

  if (loading) return <Loader title="Un momento por favor..." />

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
      <InstrumentForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={isSubmitting}
        isEditing={true}
      />
    </Box>
  )
}

export default EditInstrumentForm

EditInstrumentForm.propTypes = {
  id: PropTypes.string.isRequired,
  onSaved: PropTypes.func
}
