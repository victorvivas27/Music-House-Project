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
        position: 'fixed', 
        top: 200,
        left: 16,
        zIndex: 9999, 
        padding: '1px',
        display: 'flex',
        margin: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-primario)', 
        borderRadius: '50%',
        cursor: 'pointer',
        boxShadow: 'var(--box-shadow)',
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        animation: 'pulse 1.5s infinite ease-in-out',

        '&:hover': {
          transform: 'scale(1.1)', 
          boxShadow: 'var(--box-shadow)'
        }
      }}
    >
      <ArrowBackIcon
        sx={{
          color: 'var(--color-secundario)',
          fontSize: '20px'
        }}
      />
    </Box>
  )
}

export default ArrowBack
