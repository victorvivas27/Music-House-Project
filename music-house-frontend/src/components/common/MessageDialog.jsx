import PropTypes from 'prop-types';
import { ScreenModal } from '../common/ScreenModal'
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material'

export const MessageDialog = ({
  title,
  message,
  isOpen,
  buttonText,
  onButtonPressed,
  showCancelButton = false,
  onClose
}) => {
  return (
    <ScreenModal isOpen={isOpen} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onButtonPressed} color="secondary">
          {buttonText}
        </Button>
      </DialogActions>
      {showCancelButton && (
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      )}
    </ScreenModal>
  )
}
MessageDialog.propTypes = {
  title: PropTypes.string.isRequired,  // Título del mensaje, obligatorio
  message: PropTypes.string.isRequired,  // Mensaje a mostrar, obligatorio
  isOpen: PropTypes.bool.isRequired,  // Determina si el modal está abierto o cerrado
  buttonText: PropTypes.string.isRequired,  // Texto del botón, obligatorio
  onButtonPressed: PropTypes.func.isRequired,  // Función que se ejecuta cuando se presiona el botón, obligatorio
  showCancelButton: PropTypes.bool,  // Muestra un botón de cancelar (opcional)
  onClose: PropTypes.func.isRequired  // Función para cerrar el modal, obligatorio
};