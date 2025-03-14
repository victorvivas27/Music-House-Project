import { useCallback, useState } from 'react'
import InstrumentForm from './InstrumentForm'
import { createInstrument } from '../../api/instruments'
import { formDataToCharacteristics } from '../utils/editInstrument'
import { MessageDialog } from '../common/MessageDialog'
import ArrowBack from '../utils/ArrowBack'
//import { useNavigate } from 'react-router-dom'

const NewInstrumentForm = () => {
  //const navigate = useNavigate(); 
  const [showMessage, setShowMessage] = useState(false)
  const [message, setMessage] = useState()

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
  };

  const onClose = () => {
    setShowMessage(false)
  }

  const onSubmit = useCallback(async (formData) => {
   
  
    if (!formData) return;
  
    const formDataToSend = new FormData();
  
    // 📌 Convertir JSON correctamente
    const instrumentJson = JSON.stringify({
      name: formData.name || "",
      description: formData.description || "",
      rentalPrice: formData.rentalPrice || "",
      weight: formData.weight || "",
      measures: formData.measures || "",
      idCategory: formData.idCategory || "",
      idTheme: formData.idTheme || "",
      characteristic: formDataToCharacteristics(formData),
    });
  
    
  
    // ✅ Agregar JSON correctamente como un Blob con application/json
    formDataToSend.append("instrument", new Blob([instrumentJson], { type: "application/json" }));
  
    // ✅ Agregar imágenes correctamente
    if (formData.imageUrls && formData.imageUrls.length > 0) {
      for (let file of formData.imageUrls) {
        if (file instanceof File) {
          formDataToSend.append("files", file);
        }
      }
    }
  
   
  
    try {
      await createInstrument(formDataToSend);
      setMessage("Instrumento registrado exitosamente");
    } catch (error) {
      setMessage(error.message || "No se pudo registrar instrumento");
    } finally {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
        //navigate(-1);
      }, 2000);
    }
  }, []);


  return (
    <>
     <ArrowBack/>
      <InstrumentForm initialFormData={initialFormData} onSubmit={onSubmit} />
      <MessageDialog
        title="Registrar Instrumento"
        message={message}
        isOpen={showMessage}
        onClose={onClose}
        onButtonPressed={onClose}
      />
    </>
  );
}

export default NewInstrumentForm;
