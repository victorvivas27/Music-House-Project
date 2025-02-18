import { useCallback, useState } from 'react'
import InstrumentForm from './InstrumentForm'
import { createInstrument } from '../../api/instruments'
import { formDataToCharacteristics } from '../utils/editInstrument'
import { MessageDialog } from '../common/MessageDialog'
import { useNavigate } from 'react-router-dom'

const NewInstrumentForm = () => {
  const navigate = useNavigate(); 
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()
  const initialFormData = {
    idInstrument: '',
    name: '',
    description: '',
    measures: '',
    weight: '',
    rentalPrice: '',
    idCategory: '',
    idTheme: '',
    imageUrlsText: '',
    imageUrls: [],
    characteristics: {
      instrumentCase: false,
      support: false,
      tuner: false,
      microphone: false,
      phoneHolder: false
    }
  }

  const onClose = () => {
    setShowMessage(false)
  }

  const onSubmit = useCallback( (formData) => {
    if (!formData) return

    const data = {
      ...formData,
      characteristic: formDataToCharacteristics(formData)
    }

    createInstrument(data)
      .then(() => {
        setMessage('Instrumento registrado exitosamente')
      })
      .catch(() => {
        setMessage('No se pudo registrar instrumento')
      })
      .finally(() => {
        setShowMessage(true);
  
        // ⏳ Cierra el mensaje y redirige después de 3 segundos (3000ms)
        setTimeout(() => {
          setShowMessage(false);
          navigate(-1);  // 🔙 Regresa a la página anterior
        }, 2000);
      });
  },[navigate])

  return (
    <>
      <InstrumentForm initialFormData={initialFormData} onSubmit={onSubmit} />
      <MessageDialog
        title="Registrar Instrumento"
        message={message}
        isOpen={showMessage}
        //buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  )
}

export default NewInstrumentForm
