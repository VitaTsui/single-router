import React, { useEffect, createElement } from 'react'
import { useNavigate, useLocation } from '../hooks'

interface Route {
  path: string
  component: React.FC
}

export type Routes = Route[]

interface RProps {
  Routes: Routes
  defaultPath: string
}

export const Route: React.FC<RProps> = (props) => {
  const { Routes, defaultPath } = props
  const navigator = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (defaultPath) {
      navigator(defaultPath)
    }
  }, [])

  return (
    <>
      {Routes.map((route) => {
        return <>{route.path === location?.route && createElement(route.component)}</>
      })}
    </>
  )
}
