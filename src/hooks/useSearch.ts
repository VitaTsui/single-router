import { useContext } from 'react'
import { RouterContext, SearchContext } from '../contexts'

interface SetSearchOptions {
  replace?: boolean
}

export default function useSearch<T extends Partial<T>>(): [T, (search: T, options?: SetSearchOptions) => void] {
  const store = useContext(RouterContext)
  const search = useContext(SearchContext).search as T

  const setSearch = (search: Search, options: SetSearchOptions = {}) => {
    const state = store.getState()
    const { replace = true } = options

    if (replace) {
      const newSearch = [...state.search]
      newSearch[state.index] = search

      store.setState({ ...state, search: newSearch })
    } else {
      store.setState({
        pathname: state.pathname,
        history: [...state.history, state.pathname],
        index: state.history.length,
        search: [...state.search, search]
      })
    }
  }

  return [search, setSearch]
}
