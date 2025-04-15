import { actions } from '@/components/utils/actions'
import { getCategories, searchCategoryName } from '@/api/categories'
import SearchBar from './SearchBar'
const SearchNameCategory = () => (
  <SearchBar
    placeholder="Buscar categoría"
    searchFn={searchCategoryName}
    fetchAllFn={getCategories}
    actionType={actions.SET_CATEGORIES}
    sortKey="categoryName"
  />
)

export default SearchNameCategory
