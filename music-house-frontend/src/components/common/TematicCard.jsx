import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import {
  TitleResponsive,
  ParagraphResponsive
} from '../Form/formUsuario/CustomButton'

const TematicCard = ({ title, imageUrl, paragraph }) => {
  return (
    <Card
      sx={{
        width: '99%',
        position: 'relative',
      }}
    >
      <CardMedia
        sx={{
          height: {
            xs: 550,
            sm: 500,
            md: 550,
            lg: 550
          },
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center',

          backgroundImage: `url(${imageUrl})`,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1
          },
          zIndex: 1
        }}
      >
        <Box
          sx={{
            border: '1px dotted var(--texto-inverso-white)',
            width: '90%',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            borderRadius: '8px',
            mt: 'auto' 
          }}
        >
          <TitleResponsive>{title}</TitleResponsive>
          <ParagraphResponsive>{paragraph}</ParagraphResponsive>
        </Box>
      </CardMedia>
    </Card>
  )
}

TematicCard.propTypes = {
  title: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  paragraph: PropTypes.string
}

export default TematicCard
