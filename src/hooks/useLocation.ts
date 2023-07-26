import { useContext } from 'react'
import { LocationContext } from '../contexts'

export default function useLocation(): Router | undefined {
  return useContext(LocationContext).location
}
