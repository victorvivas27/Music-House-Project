import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  IconButton
} from '@mui/material'

import ShareIcon from '@mui/icons-material/Share'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import '../styles/product.styles.css'
import PropTypes from 'prop-types'
import { red } from '@mui/material/colors'
import { CustomTooltip } from './customTooltip/CustomTooltip'
import FavoriteIcon from './favorito/FavoriteIcon'

import { useAuth } from '../../hook/useAuth'

const ProductCard = ({ name, imageUrl, id }) => {
  const { isUser } = useAuth()

  return (
    <Card
      sx={{
        width: {
          xs: '170px',
          sm: '180px',
          md: '190px',
          lg: '200px',
          xl: '210px'
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
          <Typography variant="body2">
            <strong>{name}</strong> - haz clic en la imagen para más info
          </Typography>
        }
        arrow
      >
        <Link to={`/instrument/${id}`} className="product-link">
          <CardMedia
            component="img"
            sx={{
              width: 150,
              height: 150,
              objectFit: 'cover',
              borderRadius: '50%',
              boxShadow: 'var(--box-shadow)'
            }}
            image={imageUrl || '/default-image.jpg'}
            alt={name}
          />
        </Link>
      </CustomTooltip>
      {/* ✅ Título debajo de la imagen */}
      <Typography
        variant="subtitle1"
        textAlign="center"
        fontWeight="bold"
        sx={{
          color: 'text.primary',
          fontSize: {
            xs: '0.85rem',
            sm: '0.9rem',
            md: '1rem'
          }
        }}
      >
        {name}
      </Typography>

      <CardActions
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 40,
          width: '100%',
          marginTop: 'auto',
         
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
