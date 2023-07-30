import React from 'react'
import Route, { RouteProps } from '../components/Route'
import formatRoutes from '../_utils/formatRoutes'

export interface PathRoutes extends RouteProps {
  index?: true
  children?: Routes
}

export interface IndexRoutes extends Omit<PathRoutes, 'path'> {
  path?: string
  index: true
  children?: Routes
}

export type Routes = Array<PathRoutes | IndexRoutes>

export default function useRoutes(routes: Routes) {
  const _routes = formatRoutes(routes)
  return (
    <>
      {_routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </>
  )
}
