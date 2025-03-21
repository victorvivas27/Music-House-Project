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
import '../styles/product.styles.css'
import PropTypes from 'prop-types'
import { red } from '@mui/material/colors'
import { CustomTooltip } from './customTooltip/CustomTooltip'
import FavoriteIcon from './favorito/FavoriteIcon'
import { useAuthContext } from '../utils/context/AuthGlobal'

const ProductCard = ({ name, imageUrl, id }) => {
  const { isUser } = useAuthContext()

  return (
    <Card
      sx={{
        width: {
          xs: 'calc(48% - 8px)',
          sm: '35%',
          md: '30%',
          lg: '22%',
          xl: '12%'
        },
        height: {
          xs: 330,
          sm: 280,
          md: 320,
          lg: 350,
          xl: 350
        },
        margin: 1,
        boxShadow: 3,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-evenly'
      }}
    >
      <CardHeader
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
        title={name}
        sx={{ paddingBottom: 0 }}
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
              height: 190,
              width: 190,
              objectFit: 'contain',
              borderRadius: '50%',
              boxShadow: 'var(--box-shadow)'
            }}
            image={imageUrl || '/default-image.jpg'}
            alt={name}
          />
        </Link>
      </CustomTooltip>

      <CardActions
        disableSpacing
        sx={{ justifyContent: 'space-between', px: 2 }}
      >
        {isUser && (
          <Box>
            <FavoriteIcon idInstrument={id} />
          </Box>
        )}

        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
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
