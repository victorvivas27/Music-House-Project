import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import TematicTitle from './TematicTitle'
import PropTypes from 'prop-types'

export const TematicCard = ({ title, imageUrl }) => {
  return (
    <Card
      sx={{
        flexGrow: 1,
        width: { xs: '100%', md: '20rem', borderRadius: '10px' }
      }}
    >
      <CardMedia
        sx={{ height: 300, cursor: 'pointer', borderRadius: '10px' }}
        image={imageUrl}
        title={title}
      >
        <TematicTitle gutterBottom variant="h5" component="div">
          {title}
        </TematicTitle>
      </CardMedia>
    </Card>
  )
}

TematicCard.propTypes = {
  title: PropTypes.string.isRequired, // El título de la temática es obligatorio y debe ser un string
  imageUrl: PropTypes.string.isRequired // La URL de la imagen es obligatoria y debe ser un string
};
export default TematicCard
