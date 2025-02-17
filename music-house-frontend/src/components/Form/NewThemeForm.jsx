import { useCallback, useState } from 'react'
import { createTheme } from '../../api/theme'
import { MessageDialog } from '../common/MessageDialog'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'
import { ThemeForm } from './ThemeForm'

export const NewThemeForm = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const { dispatch } = useAppStates()
  const initialFormData = {
    idTheme: '',
    themeName: '',
    description: ''
  }

  const onClose = () => {
    setShowMessage(false)
  }

  const onSubmit = useCallback( (formData) => {
    if (!formData) return

    createTheme({
      themeName: formData.themeName.toUpperCase(),
      description: formData.description
    })
      .then(() => {
        setMessage('Tematica registrada exitosamente')
        dispatch({ type: actions.THEME_CREATED, payload: { created: true } })
      })
      .catch(() => {
        setMessage('No se pudo registrar la tematica')
      })
      .finally(() =>{
        setShowMessage(true);
        setTimeout(()=>{
          setShowMessage(false)
        },2000)
        
      } )
  },[dispatch])

  return (
    <>
      <ThemeForm initialFormData={initialFormData} onSubmit={onSubmit} />
      <MessageDialog
        title="Registrar Tematica"
        message={message}
        isOpen={showMessage}
        //buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  )
}
