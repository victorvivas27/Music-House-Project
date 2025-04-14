import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CreateWrapper,
  TitleResponsive
} from '@/components/styles/ResponsiveComponents'
import { useAppStates } from '@/components/utils/global.context'
import useAlert from '@/hook/useAlert'
import { getThemeById, updateTheme } from '@/api/theme'
import { actions } from '@/components/utils/actions'
import { getErrorMessage } from '@/api/getErrorMessage'
import { Loader } from '@/components/common/loader/Loader'
import { ThemeForm } from '@/components/Form/theme/ThemeForm'
export const EditarTheme = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [initialFormData, setInitialFormData] = useState(null)
  const { state, dispatch } = useAppStates()
  const { showSuccess, showError } = useAlert()
  const isSubmittingRef = useRef(false)

  useEffect(() => {
const getTheme = async () => {
      dispatch({ type: actions.SET_LOADING, payload:true })
      try {
        const themeData = await getThemeById(id)
        
        setInitialFormData({
          idTheme: themeData.result.idTheme || '',
          themeName: themeData.result.themeName || '',
          description: themeData.result.description || '',
          imageUrlTheme: themeData.result.imageUrlTheme || ''
        })
      } catch (err) {
        showError(`❌ ${err.message}`)
      } finally {
        dispatch({ type: actions.SET_LOADING, payload: false })
      }
    }
    getTheme()
  }, [id, showError, dispatch])

  const onSubmit = async (values) => {
    isSubmittingRef.current = true
    dispatch({ type: actions.SET_LOADING, payload: true })

    try {
      const formDataToSend = new FormData()
      const { imageUrlTheme, ...themeWithoutImageUrl } = values
      if (
        !imageUrlTheme ||
        imageUrlTheme === '' ||
        (typeof imageUrlTheme === 'string' && !(imageUrlTheme instanceof File))
      ) {
      themeWithoutImageUrl.imageUrlTheme = initialFormData.imageUrlTheme || ''
      }

      formDataToSend.append('theme', JSON.stringify(themeWithoutImageUrl))

      if (imageUrlTheme instanceof File) {
        formDataToSend.append('image', imageUrlTheme)
      }
      const response = await updateTheme(formDataToSend)
      showSuccess(`✅ ${response.message}`)

      setTimeout(() => {
        navigate('/theme')
      }, 1100)

      setTimeout(() => {
        dispatch({ type: actions.SET_LOADING, payload: false })
        isSubmittingRef.current = false
      }, 1000)

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
    <CreateWrapper>
      <TitleResponsive>Editar Temática</TitleResponsive>
      <ThemeForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={state.loading}
      />
    </CreateWrapper>
  )
}
