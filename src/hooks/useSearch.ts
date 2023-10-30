import { useContext } from 'react'
import { SearchContext } from '../contexts'

interface SetSearchOptions {
  replace?: boolean
}

export default function useSearch<T extends Partial<T>>(): [
  Search | T,
  (search: Search, options?: SetSearchOptions) => void
] {
  const search = useContext(SearchContext).search

  const setSearch = (search: Search, options: SetSearchOptions = {}) => {
    const { history, pathname, search: _search, index } = window.router
    const { replace = true } = options

    if (replace) {
      _search[index] = search

      window.router = { ...window.router, search: _search }
    } else {
      _search.push(search)
      history.push(pathname)

      window.router = {
        pathname,
        history,
        index: history.length - 1,
        search: _search
      }
    }
  }

  return [search, setSearch]
}
