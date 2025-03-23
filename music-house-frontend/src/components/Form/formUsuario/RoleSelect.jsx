import { Select, MenuItem, Typography } from '@mui/material'
import { useEffect, useState } from 'react'


import PropTypes from 'prop-types'
import { roleList } from '../../utils/roles/constants'




export const RoleSelect = ({ onChange, selectedRole = '' }) => {
  const [roleValue, setRoleValue] = useState(selectedRole)

  useEffect(() => {
    setRoleValue(selectedRole)
  }, [selectedRole])

  const handleRoleChange = (event) => {
    const value = event.target.value
    setRoleValue(value)

    if (typeof onChange === 'function') {
      onChange({
        target: {
          name: 'selectedRole',
          value
        }
      })
    }
  }

  return (
    <Select displayEmpty value={roleValue} onChange={handleRoleChange} fullWidth>
      <MenuItem value="" disabled>
        <Typography variant="h6">Asignar Rol</Typography>
      </MenuItem>

      {roleList().map((role, index) => (
        <MenuItem key={`role-${index}`} value={role.value}>
          {role.label}
        </MenuItem>
      ))}
    </Select>
  )
}

RoleSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  selectedRole: PropTypes.string
}
