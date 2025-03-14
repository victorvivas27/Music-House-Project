import { useCallback, useState } from 'react'
import InstrumentForm from './InstrumentForm'
import { createInstrument } from '../../api/instruments'
import { formDataToCharacteristics } from '../utils/editInstrument'

import ArrowBack from '../utils/ArrowBack'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
//import { useNavigate } from 'react-router-dom'

const NewInstrumentForm = () => {
  const navigate = useNavigate();
 
  
  const [loading, setLoading] = useState(false)

  const initialFormData = {
    idInstrument: null,
    name: '',
    description: '',
    measures: '',
    weight: '',
    rentalPrice: '',
    idCategory: '',
    idTheme: '',
    imageUrls: [],
    characteristics: {
      instrumentCase: false,
      support: false,
      tuner: false,
      microphone: false,
      phoneHolder: false
    }
  }

 

  const onSubmit = useCallback(async (formData) => {
    setLoading(true)

    if (!formData) return

    const formDataToSend = new FormData()

    // 📌 Convertir JSON correctamente
    const instrumentJson = JSON.stringify({
      name: formData.name || '',
      description: formData.description || '',
      rentalPrice: formData.rentalPrice || '',
      weight: formData.weight || '',
      measures: formData.measures || '',
      idCategory: formData.idCategory || '',
      idTheme: formData.idTheme || '',
      characteristic: formDataToCharacteristics(formData)
    })

    // ✅ Agregar JSON correctamente como un Blob con application/json
    formDataToSend.append(
      'instrument',
      new Blob([instrumentJson], { type: 'application/json' })
    )

    // ✅ Agregar imágenes correctamente
    if (formData.imageUrls && formData.imageUrls.length > 0) {
      for (let file of formData.imageUrls) {
        if (file instanceof File) {
          formDataToSend.append('files', file)
        }
      }
    }

    try {
      await createInstrument(formDataToSend)
        // ✅ Éxito: Mostrar alerta y redirigir
        Swal.fire({
          icon: 'success',
          title: 'Instrumento Creado',
          text: 'El instrumento se ha registrado correctamente.',
          confirmButtonText: 'Aceptar',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          navigate(-1) // 🔹 Redirigir a la página anterior
        })
      
    } catch (error) {
       // ❌ Error: Mostrar mensaje con detalles
       Swal.fire({
        icon: 'error',
        title: 'Error al Crear',
        text: error.message || 'No se pudo registrar el instrumento.',
        confirmButtonText: 'Intentar nuevamente'
      })
    } finally {
     
      setTimeout(() => {
        
        
        setLoading(false)
      }, 2000)
    }
  }, [navigate])

  return (
    <>
      <ArrowBack />
      <InstrumentForm
        initialFormData={initialFormData}
        onSubmit={onSubmit}
        loading={loading}
      />
      
    </>
  )
}

export default NewInstrumentForm
