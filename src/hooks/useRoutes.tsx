import React from 'react'
import Route from '../components/Route'
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
  const _routes = formatRoutes(routes)

  return (
    <>
      {_routes.map((route, index) => (
        <Route key={index} {...route} />
      ))}
    </>
  )
}
