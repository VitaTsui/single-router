import React, { useContext } from 'react'
import { OutletContext, OutletValueContext } from '../contexts'

interface OutletProps {
  /** 透传给子路由的上下文值，子路由内通过 useOutletContext() 读取 */
  context?: unknown
}

/** 渲染当前匹配的子路由（配合 useRoutes 的 children 使用） */
const Outlet: React.FC<OutletProps> = (props) => {
  const { context } = props
  const { element } = useContext(OutletContext)

  if (!element) return null

  return <OutletValueContext.Provider value={context}>{element}</OutletValueContext.Provider>
}

export default Outlet
