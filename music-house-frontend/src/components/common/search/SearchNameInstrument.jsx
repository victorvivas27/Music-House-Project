import { getInstruments, searchInstrumentsByName } from "@/api/instruments"
import { actions } from "@/components/utils/actions"
import SearchBar from "./SearchBar"

const SearchNameInstrument = () => (
    <SearchBar
      placeholder="Buscar instrumento"
      searchFn={searchInstrumentsByName}
      fetchAllFn={getInstruments}
      actionType={actions.SET_INSTRUMENTS}
      sortKey="name"
    />
  )
  
  export default SearchNameInstrument