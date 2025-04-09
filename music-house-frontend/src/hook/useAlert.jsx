import { useCallback } from 'react'
import Swal from 'sweetalert2'

const useAlert = () => {

  const showConfirm = useCallback(async (
    title,
    text,
    confirmText = 'Sí, continuar',
    cancelText = 'Cancelar'
  ) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: 'var(--color-error)',
      cancelButtonColor: 'var(--color-azul)',
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: 'var(--color-secundario)',
      color: 'var(--color-primario)',
      borderRadius: '40px',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      customClass: {
        popup: 'custom-swal',
        confirmButton: 'custom-swal-btn',
        cancelButton:'custom-swal-btn-can',
      }
    })

    return result.isConfirmed
  }, [])

  const showLoading = useCallback((title = 'Procesando...', text = 'Por favor espera.') => {
    Swal.fire({
      title,
      text,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: 'var(--color-secundario)',
      color: 'var(--color-primario)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      didOpen: () => {
        Swal.showLoading()
      },
      customClass: {
        popup: 'custom-swal'
      }
    })
  }, [])

  const showSuccess = useCallback((title = '¡Éxito!', text, onClose) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      showConfirmButton: false,
      timer: 2050,
      timerProgressBar: true,
      background: 'var(--color-secundario)',
      color: 'var(--color-primario)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      customClass: {
        popup: 'custom-swal'
      },
      didClose: () => {
        if (onClose) onClose()
      }
    })
  }, [])

  const showError = useCallback((title = 'Error', text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Entendido ✔️',
      background: 'var(--color-secundario)',
      color: 'var(--color-primario)',
      showClass: {
        popup: 'animate__animated animate__fadeInDown'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      customClass: {
        popup: 'custom-swal',
        confirmButton: 'custom-swal-btn'
      }
    })
  }, [])

  return {
    showConfirm,
    showLoading,
    showSuccess,
    showError
  }
}

export default useAlert
