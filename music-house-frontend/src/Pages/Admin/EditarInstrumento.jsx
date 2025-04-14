import { useNavigate, useParams } from 'react-router-dom'
import { Box} from '@mui/material'

import { CreateWrapper, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import PropTypes from 'prop-types'
import InstrumentForm from '@/components/Form/instrument/InstrumentForm'
import { Loader } from '@/components/common/loader/Loader'
import { getErrorMessage } from '@/api/getErrorMessage'
import { addImage } from '@/api/images'
import { getInstrumentById, updateInstrument } from '@/api/instruments'
import { characteristicsToFormData, formDataToCharacteristics } from '@/components/utils/editInstrument'
import { useEffect, useRef, useState } from 'react'
import useAlert from '@/hook/useAlert'
import { useAppStates } from '@/components/utils/global.context'
import { actions } from '@/components/utils/actions'


export const EditarInstrumento = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialFormData, setInitialFormData] = useState(null)
  const { state, dispatch } = useAppStates()
  const { showSuccess, showError } = useAlert()
   const isSubmittingRef = useRef(false)

useEffect(() => {
   const getInstrument = async () => {
 dispatch({ type: actions.SET_LOADING, payload:true })
    try {
      const instrumentData = await getInstrumentById(id)
 setInitialFormData({
      idInstrument: instrumentData.result.idInstrument || '',
      name: instrumentData.result.name || '',
      description: instrumentData.result.description || '',
      measures: instrumentData.result.measures || '',
      weight: instrumentData.result.weight || '',
      rentalPrice: instrumentData.result.rentalPrice || '',
      idCategory: instrumentData.result.category?.idCategory || '',
      idTheme: instrumentData.result.theme?.idTheme || '',
      characteristics: characteristicsToFormData({ result: instrumentData.result })
     
    })
  }catch (err) {
    showError(`❌ ${err.message}`)
  
  } finally {
    dispatch({ type: actions.SET_LOADING, payload: false })
  }
}

  getInstrument()

  }, [dispatch, id, showError, state.instruments])

  const onSubmit = async (formData) => {
    isSubmittingRef.current = true
      dispatch({ type: actions.SET_LOADING, payload: true })
    if (!formData) return

    const data = {
      ...formData,
      characteristic: formDataToCharacteristics(formData)
    }

   

    try {
      const response = await updateInstrument(data)

      if (response?.result) {
        if (formData.imageUrls && formData.imageUrls.length > 0) {
          const formDataImages = new FormData()

          formDataImages.append(
            'data',
            new Blob([
              JSON.stringify({ idInstrument: formData.idInstrument })
            ], { type: 'application/json' })
          )

          formData.imageUrls.forEach((file) => {
            formDataImages.append('files', file)
          })

          await addImage(formDataImages)
        }
        showSuccess(`✅ ${response.message}`)

        setTimeout(() => {
          navigate('/instruments')
        }, 1100)

   setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
        isSubmittingRef.current = false
      }, 1000)

      } 
    } catch (error) {
      showError(`❌ ${getErrorMessage(error)}`)
       dispatch({ type: actions.SET_LOADING, payload: false })
            isSubmittingRef.current = false
    }
  }

  if (!initialFormData && !isSubmittingRef.current) {
    return <Loader title="Un momento por favor..." />
  }

  return (
   
      <CreateWrapper >
        <TitleResponsive>Editar Instrumento</TitleResponsive>
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
            loading={state.loading}
            isEditing={true}
          />
        </Box>
      </CreateWrapper>

     
   
  )
}

EditarInstrumento.propTypes = {
  id: PropTypes.string
}

export default EditarInstrumento
