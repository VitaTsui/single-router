import React from 'react'
import Route from '../components/Route'
import NestedRoute from '../components/NestedRoute'
import formatRoutes from '../_utils/formatRoutes'

export interface PathRoutes {
  path: string
  index?: true
  element?: React.ReactElement | null
  children?: Routes
}

export interface IndexRoutes {
  index: true
  path?: string
  element?: React.ReactElement | null
  children?: Routes
}

export type Routes = Array<PathRoutes | IndexRoutes>

export default function useRoutes(routes: Routes) {
  return (
    <>
      {routes.map((route, i) => {
        // 有 children 的路由：走 NestedRoute，支持 Outlet
        if (route.children) {
          const path = (route as PathRoutes).path ?? ''
          return (
            <NestedRoute
              key={i}
              path={path}
              element={route.element}
              routes={route.children}
            />
          )
        }

        // 无 children 的路由：保持原有 flat 渲染逻辑
        const flat = formatRoutes([route])
        return flat.map((r, j) => <Route key={`${i}-${j}`} {...r} />)
      })}
    </>
  )
}
