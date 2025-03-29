import Swal from 'sweetalert2'

const useAlert = () => {
  // ✅ Alerta genérica
  const showAlert = ({
    title,
    text,
    icon = 'info',
    showCancelButton = false,
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
    onConfirm = null
  }) => {
    Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      allowOutsideClick: false,
      allowEscapeKey: false,
      customClass: {
        popup: 'custom-swal'
      }
    }).then((result) => {
      if (result.isConfirmed && onConfirm) {
        onConfirm()
      }
    })
  }

  // ✅ Alerta de confirmación antes de realizar una acción
  const showConfirm = async (
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
  }

  // ✅ Alerta de carga mientras se procesa una acción
  const showLoading = (title = 'Procesando...', text = 'Por favor espera.') => {
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
  }

  // ✅ Alerta de éxito
const showSuccess = (
  title = '¡Éxito!',
  text,
  onClose // ✅ callback opcional
) => {
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
}

  // ✅ Alerta de error
  const showError = (title = 'Error',text) => {
    Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonColor: '#d33',
      confirmButtonText: 'Entendido ✔️', // Cambiás el texto
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
        confirmButton: 'custom-swal-btn' // Aplicás tu clase
      }
    })
  }

  return {
    showAlert,
    showConfirm,
    showLoading,
    showSuccess,
    showError
  }
}

export default useAlert
