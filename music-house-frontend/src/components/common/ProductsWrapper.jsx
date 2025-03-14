import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'

 const ProductsWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  gap: '1rem',
  paddingTop: 1,
  border:"2px solid blue",

  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row'
  },

  [theme.breakpoints.up('md')]: {
    paddingTop: 3
  }
}))

export default ProductsWrapper