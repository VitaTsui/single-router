import { useContext } from 'react'
import { OutletValueContext } from '../contexts'

/** 读取最近一层 <Outlet context={...}> 透传的值 */
export default function useOutletContext<T = unknown>(): T {
  return useContext(OutletValueContext) as T
}
