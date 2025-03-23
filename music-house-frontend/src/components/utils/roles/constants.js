
export const ROLE_USER = 'ROLE_USER';
export const ROLE_ADMIN = 'ROLE_ADMIN';
export const ROLE_VISITADOR = 'ROLE_VISITADOR'; 

export const USER = 'USER';
export const ADMIN = 'ADMIN';
export const VISITADOR = 'VISITADOR';

export const roleList = () => [
  { value: USER, label: 'Usuario' },
  { value: ADMIN, label: 'Administrador' },
  { value: VISITADOR, label: 'Visitador' }
]

export const roleByValue = (value) => {
  return roleList().find((r) => r.value === value)
}

 