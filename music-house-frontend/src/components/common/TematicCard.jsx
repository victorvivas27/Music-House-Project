import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import TematicTitle from './TematicTitle'
import PropTypes from 'prop-types'
import { ParagraphResponsive } from '../Form/formUsuario/CustomButton'
import { Box } from '@mui/material'

export const TematicCard = ({ title, imageUrl,paragraph }) => {
  return (
    <Card
    sx={{
      flexGrow: 1,
      margin: 1,
      width: {
        xs: '100%',
        md: '20rem'
      },
      borderRadius: '10px',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    <CardMedia
      sx={{
        height: 500,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: 2,
        backgroundImage: `url(${imageUrl})`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        },
        zIndex: 1
      }}
    >
      {/* El contenido visible */}
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        <TematicTitle gutterBottom variant="h5" component="div">
          {title}
        </TematicTitle>
        <ParagraphResponsive gutterBottom>
          {paragraph}
        </ParagraphResponsive>
      </Box>
    </CardMedia>
  </Card>
  )
}

TematicCard.propTypes = {
  title: PropTypes.string.isRequired, 
  imageUrl: PropTypes.string.isRequired,
  paragraph:PropTypes.string 
};
export default TematicCard
