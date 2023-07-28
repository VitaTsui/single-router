import { useContext } from 'react'
import { LocationContext } from '../contexts'

export default function useLocation(): IRouter | undefined {
  return useContext(LocationContext).location
}
