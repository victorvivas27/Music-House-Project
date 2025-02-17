import { useCallback, useState } from 'react'
import { CategoryForm } from './CategoryForm'
import { createCategory } from '../../api/categories'
import { MessageDialog } from '../common/MessageDialog'
import { useAppStates } from '../utils/global.context'
import { actions } from '../utils/actions'

export const NewCategoryForm = () => {
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const { dispatch } = useAppStates()
  const initialFormData = {
    idCategory: '',
    categoryName: '',
    description: ''
  }

  const onClose = () => {
    setShowMessage(false)
  }

  const onSubmit = useCallback( (formData) => {
    if (!formData) return

    createCategory({
      categoryName: formData.categoryName,
      description: formData.description
    })
      .then(() => {
        setMessage('Categoría registrada exitosamente')
        dispatch({ type: actions.CATEGORY_CREATED, payload: { created: true } })
      })
      .catch(() => {
        setMessage('No se pudo registrar categoría')
      })
      .finally(() => {
        setShowMessage(true);
  
        // Cerrar la ventana emergente automáticamente después de 3 segundos
        setTimeout(() => {
          setShowMessage(false);
        }, 2000);
      });
  },[dispatch])

  return (
    <>
      <CategoryForm initialFormData={initialFormData} onSubmit={onSubmit} />
      <MessageDialog
        title="Registrar Categoría"
        message={message}
        isOpen={showMessage}
        //buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  )
}
