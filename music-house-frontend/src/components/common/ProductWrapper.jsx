import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'

export const ProductWrapper = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  cursor: 'pointer'
}))

export default ProductWrapper
