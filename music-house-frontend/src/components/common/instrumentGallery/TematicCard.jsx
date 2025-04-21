import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { ParagraphResponsive, TitleResponsive } from '@/components/styles/ResponsiveComponents'
import { flexColumnContainer } from '@/components/styles/styleglobal'




const TematicCard = ({ title, imageUrlTheme, paragraph }) => {
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
          ...flexColumnContainer,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          textAlign: 'center',

          backgroundImage: imageUrlTheme ? `url(${encodeURI(imageUrlTheme)})` : 'none',
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
  imageUrlTheme: PropTypes.string.isRequired,
  paragraph: PropTypes.string
}

export default TematicCard
