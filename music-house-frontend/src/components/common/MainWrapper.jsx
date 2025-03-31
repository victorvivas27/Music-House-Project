import { styled } from '@mui/material/styles'

import { Box } from '@mui/material'

export const MainWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'flex-start', 
  alignItems: 'center', 
  width: '98vw',
  marginTop: 310, 
  marginBottom: 50,
  border:"1px solid blue"
  
}))

export default MainWrapper
