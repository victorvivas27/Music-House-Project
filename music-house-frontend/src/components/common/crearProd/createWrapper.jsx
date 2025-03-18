import { styled } from '@mui/material/styles'
import { Container } from '@mui/material'


// 📌 Filtrar `isHeaderVisible` para que no llegue al DOM
export const CreateWrapper = styled(Container, {
  shouldForwardProp: (prop) => prop !== 'isHeaderVisible'
})(({ theme, isHeaderVisible }) => ({
  display: 'none',
  
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
   // justifyContent: 'flex-start',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '14rem',
   /** ✅ Permite que el contenedor crezca dinámicamente **/
   width: '100%',  // Asegura que use todo el ancho disponible
   minHeight: '100vh',  // Ocupar toda la pantalla si es necesario
   height: 'auto', // Crecer dinámicamente según el contenido
   maxWidth: '90%', // Opcional, limita el crecimiento en pantallas grandes
   
    paddingTop: isHeaderVisible ? 50 : 50,
    //border:"10px solid blue",
    marginTop:"310px",
   transition: 'padding-top 1s ease-in-out'
  }
}));

export default CreateWrapper;
