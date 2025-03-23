import { useContext } from "react"
import { AuthContext } from "../components/utils/context/AuthContext"

export const useAuth=()=>{
 return useContext(AuthContext)
}