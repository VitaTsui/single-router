import React from 'react'
import Route from '../components/Route'
import NestedRoute from '../components/NestedRoute'
import formatRoutes from '../_utils/formatRoutes'

export interface PathRoutes {
  /** Route path; child routes may use a relative segment (e.g. '/:id', auto-joined with the parent path) or a full path */
  path: string
  /** Whether this is the parent path's default child route */
  index?: true
  /** Element rendered on match; with children it is usually a layout component that renders child routes via <Outlet /> */
  element?: React.ReactElement | null
  /** Nested child routes */
  children?: Routes
}

export interface IndexRoutes {
  /** Default child route: its path equals the parent path */
  index: true
  path?: string
  element?: React.ReactElement | null
  children?: Routes
}

/** Route config tree consumed by useRoutes to generate route elements */
export type Routes = Array<PathRoutes | IndexRoutes>

/**
 * Generates route elements from a route config tree.
 * Nodes with children go through NestedRoute (supports <Outlet /> nested layouts);
 * the rest are expanded directly into <Route />.
 */
export default function useRoutes(routes: Routes) {
  return (
    <>
      {routes.map((route, i) => {
        // Routes with children: go through NestedRoute, which supports Outlet
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

        // Routes without children: expand directly into <Route />
        const flat = formatRoutes([route])
        return flat.map((r, j) => <Route key={`${i}-${j}`} {...r} />)
      })}
    </>
  )
}
