import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'

const ArrowBack = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleBackClick = () => {
    if (location.key !== 'default') {
      navigate('/')
    }
  }

  return (
    <Box
      onClick={handleBackClick}
      sx={{
        width: '30px',
        height: '30px',
        display: 'flex',
        margin: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-primario)', // Amarillo dorado
        borderRadius: '50%', // Hace que el botón sea redondo
        cursor: 'pointer',
        boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        animation: 'pulse 1.5s infinite ease-in-out',
       
        '&:hover': {
          transform: 'scale(1.1)', // Efecto de crecimiento suave
          boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)'
        }
      }}
    >
      <ArrowBackIcon sx={{ 
        color: 'var(--texto-inverso)',
         fontSize: '30px' ,
       
         }} />
    </Box>
  )
}

export default ArrowBack
