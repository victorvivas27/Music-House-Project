import { useCallback} from 'react'
import { createTheme } from '../../api/theme'

import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import { ThemeForm } from './ThemeForm'
import useAlert from '../../hook/useAlert'

export const NewThemeForm = () => {

  const { dispatch,state } = useAppStates()
  const { showSuccess, showError } = useAlert()

  const initialFormData = {
    idTheme: '',
    themeName: '',
    description: ''
  }

 const onSubmit = useCallback(
  async (formData) => {
    if (!formData) return

    dispatch({ type: actions.SET_LOADING, payload: true })

    try{
      const response=await createTheme({
        themeName: formData.themeName,
        description: formData.description
      })

      if(response?.message){
        setTimeout(() => {
          showSuccess(`✅ ${response.message}`)
        }, 1100)

        dispatch({
           type: actions.THEME_CREATED, 
           payload: { created: true }
           })
        
          }
      }catch(error ) {
        showError(
          `❌ ${error?.data?.message || '⚠️ No se pudo conectar con el servidor.'}`
        )
      } finally{
      
        setTimeout(()=>{
          dispatch({ type: actions.SET_LOADING, payload: false })
        },1000)
        
      } 
    
  },
  [dispatch, showError, showSuccess]
)

  return (
    <>
      <ThemeForm 
      initialFormData={initialFormData} 
      onSubmit={onSubmit}
      loading={state.loading}
       />
    
    </>
  )
}
