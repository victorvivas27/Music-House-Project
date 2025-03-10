import { styled } from '@mui/material/styles'
import Container from '@mui/material/Container'

export const MainWrapper = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  marginTop:'400px' ,
  marginBottom: '100px',
  alignItems: 'center',
 }))

export default MainWrapper
