import { styled, alpha } from '@mui/material/styles'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { ProductWrapper } from './ProductWrapper'
import { Link } from 'react-router-dom'
import { Button, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import '../styles/product.styles.css'

const DeleteFavoriteIcon = styled(DeleteIcon)(({ theme }) => ({
  fill: '#000000 !important',
  '&:hover': {
    fill: `${alpha(theme.palette.secondary.main, 0.7)} !important`
  }
}))

const ProductCard = ({
  name,
  imageUrl,
  id,
  isFavorite = false,
  onClickTrash
}) => {
  return (
    <ProductWrapper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: { xs: '100%', md: '15rem' },
        borderRadius: '.625rem',
        padding: '.5rem'
      }}
    >
      <Link to={`/instrument/${id}`} className="product-link">
        <CardMedia
          sx={{
            height: 300,
            cursor: 'pointer',
            backgroundSize: 'contain !important'
          }}
          image={imageUrl}
          alt={name}
        />
        <CardContent
          sx={{
            paddingBottom: isFavorite ? '0rem !important' : '1.5rem !important'
          }}
        >
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
        </CardContent>
      </Link>
      {isFavorite && (
        <Tooltip title="Remover de favoritos">
          <Button sx={{ height: '3rem' }} onClick={onClickTrash}>
            <DeleteFavoriteIcon fontSize="large" />
          </Button>
        </Tooltip>
      )}
    </ProductWrapper>
  )
}

export default ProductCard
