import { useContext } from 'react'
import { LocationContext } from '../contexts'

export default function useLocation(): IRouter {
  const location = useContext(LocationContext).location

  return location
}
