import { actions } from '@/components/utils/actions'
import { searchUserName, UsersApi } from '@/api/users'
import SearchBar from './SearchBar'

const SearchNameUser = () => (
  <SearchBar
    placeholder="Buscar Usuario"
    searchFn={searchUserName}
    fetchAllFn={UsersApi.getUsers}
    actionType={actions.SET_USERS}
    sortKey="name"
  />
)

export default SearchNameUser
