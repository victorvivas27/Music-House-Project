import { useState } from 'react'
import InstrumentForm from './InstrumentForm'
import { createInstrument } from '../../api/instruments'
import { formDataToCharacteristics } from '../utils/editInstrument'
import { MessageDialog } from '../common/MessageDialog'

const NewInstrumentForm = () => {
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

  const onSubmit = (formData) => {
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
      .finally(() => setShowMessage(true))
  }

  return (
    <>
      <InstrumentForm initialFormData={initialFormData} onSubmit={onSubmit} />
      <MessageDialog
        title="Registrar Instrumento"
        message={message}
        isOpen={showMessage}
        buttonText="Ok"
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  )
}

export default NewInstrumentForm
