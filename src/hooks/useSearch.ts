import { useContext } from 'react'
import { SearchContext } from '../contexts'

export default function useSearch<T extends Partial<T>>(): Search | T {
  const search = useContext(SearchContext).search

  return search
}
