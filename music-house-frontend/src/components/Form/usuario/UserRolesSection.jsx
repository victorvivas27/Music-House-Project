import { Box, Button, FormControl } from "@mui/material"
import PropTypes from "prop-types"
import { RoleSelect } from "./RoleSelect"
import { flexRowContainer, inputStyles } from "@/components/styles/styleglobal"
import useAlert from "@/hook/useAlert"

export const UserRolesSection = ({ formData, isUserAdmin, setFormData }) => {
    const { showConfirm, showError, showSuccess } = useAlert()
  
    const handleRemoveRole = async (roleToRemove) => {
      if (!isUserAdmin) return
  
      if (formData.roles.length <= 1) {
        showError('El usuario debe tener al menos un rol.')
        return
      }
  
      const isConfirmed = await showConfirm(
        '¿Estás seguro?',
        `Vas a quitar el rol ${roleToRemove}.`,
        'Sí, quitar',
        'Cancelar'
      )
  
      if (!isConfirmed) return
  
      setFormData((prev) => ({
        ...prev,
        roles: prev.roles.filter((r) => r !== roleToRemove)
      }))
  
      showSuccess(`El rol ${roleToRemove} ha sido quitado.`)
    }
  
    if (!formData?.idUser || !isUserAdmin) return null
  
    return (
      <Box sx={{  }}>
        {formData.roles?.length > 0 && (
          <Box sx={{ ...flexRowContainer }}>
            {formData.roles.map((role) => (
              <Button
                key={role}
                onClick={() => handleRemoveRole(role)}
                sx={{
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--texto-inverso-black)',
                  padding: '10px 15px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  margin: '2px'
                }}
              >
                Quitar {role}
              </Button>
            ))}
          </Box>
        )}
  
        <FormControl sx={{ ...inputStyles }}>
          <RoleSelect selectedRole={formData?.selectedRole} />
        </FormControl>
      </Box>
    )
  }
  
  UserRolesSection.propTypes = {
    formData: PropTypes.object.isRequired,
    isUserAdmin: PropTypes.bool.isRequired,
    setFormData: PropTypes.func.isRequired
  }