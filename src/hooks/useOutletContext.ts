import { useContext } from 'react'
import { OutletValueContext } from '../contexts'

/** Reads the value passed down by the nearest <Outlet context={...}> */
export default function useOutletContext<T = unknown>(): T {
  return useContext(OutletValueContext) as T
}
