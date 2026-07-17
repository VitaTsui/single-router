import { useContext } from 'react'
import { LocationContext } from '../contexts'

/**
 * Returns the current routing state `{ pathname, history, index, search }`;
 * the initial state is `{ pathname: '', history: [], index: -1 }`.
 */
export default function useLocation(): IRouter {
  const location = useContext(LocationContext).location

  return location
}
