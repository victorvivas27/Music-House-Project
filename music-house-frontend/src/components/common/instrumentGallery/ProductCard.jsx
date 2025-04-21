import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardHeader,
  IconButton
} from '@mui/material'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import PropTypes from 'prop-types'
import { red } from '@mui/material/colors'
import { useState } from 'react'
import { useAuth } from '@/hook/useAuth'
import { CustomTooltip } from '../customTooltip/CustomTooltip'
import FavoriteIcon from '../favorito/FavoriteIcon'
import { ParagraphResponsive } from '@/components/styles/ResponsiveComponents'

const ProductCard = ({ name, imageUrl, id }) => {
  const { isUser } = useAuth()
  const [imgError, setImgError] = useState(false)

  return (
    <Card
      sx={{
        width: {
          xs: '170px',
          sm: '180px',
          md: '190px',
          lg: '200px',
          xl: '250px'
        },
        height: {
          xs: '330px',
          sm: '340px',
          md: '350px',
          lg: '360px',
          xl: '350px'
        },
        margin: 1,
        boxShadow: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom: 2,
        gap: 1
      }}
    >
      <CardHeader
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          width: '100%'
        }}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="product">
            {name.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />

      <CustomTooltip
        title={
          <Typography
            sx={{
              fontFamily: 'Roboto',
              fontSize: 10
            }}
          >
            <strong>✅ Más info</strong>
          </Typography>
        }
        arrow
      >
        <Link to={`/instrument/${id}`}>
          {!imgError ? (
            <CardMedia
              component="img"
              sx={{
                width: 150,
                height: 150,
                objectFit: 'cover',
                borderRadius: '50%',
                boxShadow: 'var(--box-shadow)'
              }}
              image={imageUrl || '/src/assets/instrumento_general_03.jpg'}
              alt={name}
              onError={() => setImgError(true)}
            />
          ) : (
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#eee',
                fontSize: '0.75rem',
                textAlign: 'center',
                padding: 1,
                boxShadow: 'var(--box-shadow)'
              }}
            >
              Imagen no disponible: {name}
            </Box>
          )}
        </Link>
      </CustomTooltip>
      {/* ✅ Título debajo de la imagen */}
      <ParagraphResponsive>{name}</ParagraphResponsive>

      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 30,
          width: '100%',
          marginTop: 'auto'
        }}
      >
        {isUser && (
          <>
            <FavoriteIcon idInstrument={id} />
            <ShareIcon />
          </>
        )}
      </CardActions>
    </Card>
  )
}

ProductCard.propTypes = {
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
  onClickTrash: PropTypes.func
}

export default ProductCard
