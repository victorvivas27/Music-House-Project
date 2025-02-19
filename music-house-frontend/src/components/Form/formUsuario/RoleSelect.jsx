import { Select, MenuItem } from '@mui/material'
import { useEffect, useState } from 'react'
import { roleList } from '../../utils/roles/constants'
import { Loader } from '../../common/loader/Loader'

const roles = roleList()

export const RoleSelect = ({
  label,
  onChange,
  selectedRoleId = undefined,
  sx
}) => {
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('')

  useEffect(() => {
    if (!roles) return

    setLoading(false)
  }, [])

  useEffect(() => {
    if (!selectedRoleId || !roles) return

    const selectedRole = roles.find((role) => role.idRol === selectedRoleId)
    setSelectedRole(selectedRole)
  }, [selectedRoleId])

  useEffect(() => {
    if (loading) return
    if (typeof onChange === 'function')
      onChange({
        target: { name: 'idRol', value: selectedRole.idRol }
      })
  }, [loading, onChange, selectedRole])

  if (loading) {
    return <Loader fullSize={false} />
  }

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value)
  }

  return (
    <Select
      value={selectedRole}
      onChange={handleRoleChange}
      label={label}
      color="secondary"
      sx={sx}
    >
      {roles?.map((role, index) => (
        <MenuItem key={`role-select-${index}`} value={role}>
          {role.rol}
        </MenuItem>
      ))}
    </Select>
  )
}
