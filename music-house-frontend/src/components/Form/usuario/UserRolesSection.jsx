import { Box, Button, FormControl } from '@mui/material'
import PropTypes from 'prop-types'
import { RoleSelect } from './RoleSelect'
import { flexRowContainer, inputStyles } from '@/components/styles/styleglobal'
import useAlert from '@/hook/useAlert'
import { useState } from 'react'

export const UserRolesSection = ({ roles, isUserAdmin, setFieldValue }) => {
  const { showConfirm, showError, showSuccess } = useAlert()
  const [selectedRole, setSelectedRole] = useState('')

  const handleRemoveRole = async (roleToRemove) => {
    if (!isUserAdmin) return

    if (roles.length <= 1) {
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

    const updatedRoles = roles.filter((r) => r !== roleToRemove)
    setFieldValue('roles', updatedRoles)
    showSuccess(`El rol ${roleToRemove} ha sido quitado.`)
  }

  const handleAddRole = async () => {
    if (!selectedRole || roles.includes(selectedRole)) {
      showError('Rol inválido o ya asignado.')
      return
    }

    const isConfirmed = await showConfirm(
      '¿Agregar nuevo rol?',
      `Estás a punto de agregar el rol ${selectedRole}. ¿Deseas continuar?`,
      'Sí, agregar',
      'Cancelar'
    )

    if (!isConfirmed) return

    const updatedRoles = [...roles, selectedRole]
    setFieldValue('roles', updatedRoles)
    showSuccess(`El rol ${selectedRole} fue agregado correctamente.`)
    setSelectedRole('')
  }

  if (!roles || !isUserAdmin) return null

  return (
    <Box>
      {roles?.length > 0 && (
        <Box sx={{ ...flexRowContainer, flexWrap: 'wrap' }}>
          {roles.map((role) => (
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
                margin: '4px'
              }}
            >
              Quitar {role}
            </Button>
          ))}
        </Box>
      )}

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ ...inputStyles, flex: 1 }}>
          <RoleSelect
            selectedRole={selectedRole}
            onChange={(value) => setSelectedRole(value)}
          />
        </FormControl>

        <Button
          onClick={handleAddRole}
          variant="contained"
          disabled={!selectedRole}
        >
          Agregar rol
        </Button>
      </Box>
    </Box>
  )
}

UserRolesSection.propTypes = {
  roles: PropTypes.array.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired
}
