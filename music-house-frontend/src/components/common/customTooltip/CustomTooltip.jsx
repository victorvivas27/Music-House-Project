import { styled, Tooltip, tooltipClasses } from "@mui/material";


const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'var(--color-primario)',
    color: 'var(--color-secundario)',
    fontSize: '0.875rem',
    borderRadius: '50px',
    padding: '10px 25px',
    boxShadow: 'var(--box-shadow)',
   
    
   
  }
}))

export const CustomTooltip = (props) => {
  return <StyledTooltip arrow placement="top" {...props} />
}