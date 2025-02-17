import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'

export const InstrumentDetailWrapper = styled(Container)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: '.5rem',
  width: '100%',

  [theme.breakpoints.up('sm')]: {
    gap: '1rem'
  },

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gap: '3rem'
  }
}))
