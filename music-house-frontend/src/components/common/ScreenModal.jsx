import { forwardRef } from 'react'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ScreenModal = ({
  isOpen,
  onClose,
  children,
  fullScreen = false
}) => {
  const handleClose = () => {
    open.current = false
    if (typeof onClose === 'function') onClose()
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
      maxWidth="md"
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1300
        }}
      >
        <CloseIcon />
      </IconButton>
      {children}
    </Dialog>
  )
}
