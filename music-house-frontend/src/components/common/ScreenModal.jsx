import { forwardRef } from 'react'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import PropTypes from 'prop-types'

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
      PaperProps={{
        sx: {
          width: '90%',
          maxWidth: '800px',
          margin: 'auto',
          borderRadius: 3,
          padding: 2,
          boxShadow: 'var(--box-shadow)'
        }
      }}
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
        <CloseIcon sx={{ fontSize: '40px' }} />
      </IconButton>
      {children}
    </Dialog>
  )
}

ScreenModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  fullScreen: PropTypes.bool
}
