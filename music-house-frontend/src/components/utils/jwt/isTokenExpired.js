import { jwtDecode } from "jwt-decode"

export const isTokenExpired = (token) => {
    try {
      const { exp } = jwtDecode(token)
      return !exp || exp < Date.now() / 1000
    } catch (e) {
      return true
    }
  }