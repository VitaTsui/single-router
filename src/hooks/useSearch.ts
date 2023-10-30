import { useContext } from 'react'
import { SearchContext } from '../contexts'

export default function useSearch<T extends Partial<T>>(): [Search | T, (search: Search) => void] {
  const search = useContext(SearchContext).search
  const setSearch = (search: Search) => {
    const { search: _search, index } = window.router
    _search[index] = search

    window.router = {
      ...window.router,
      search: _search
    }
  }

  return [search, setSearch]
}
