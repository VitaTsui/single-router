import { useContext } from 'react'
import { LocationContext } from '../contexts'

export default function useLocation(): IRouter {
  return useContext(LocationContext).location
}
