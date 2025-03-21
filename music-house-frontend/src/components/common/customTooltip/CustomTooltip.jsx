import { styled, Tooltip, tooltipClasses } from "@mui/material";

export const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(() => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: 'var(--color-primario)',
      color: 'var(--color-secundario)',
      fontSize: '0.875rem',
      borderRadius: '8px',
      padding: '10px 25px',
    },
  }));