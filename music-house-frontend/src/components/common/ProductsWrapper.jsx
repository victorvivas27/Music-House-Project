import { styled } from '@mui/material/styles'

import { Box } from '@mui/material';

const ProductsWrapper = styled(Box)(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: 2,
  width: '100%',
  maxWidth: '99%',
  margin: '0 auto',
 
}))

export default ProductsWrapper