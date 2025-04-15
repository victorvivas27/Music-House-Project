import { getTheme, searchThemeName } from '@/api/theme'
import { actions } from '@/components/utils/actions'
import SearchBar from './SearchBar'

const SearchNameTheme = () => (
  <SearchBar
    placeholder="Buscar temática"
    searchFn={searchThemeName}
    fetchAllFn={getTheme}
    actionType={actions.SET_THEMES}
    sortKey="themeName"
  />
)

export default SearchNameTheme
