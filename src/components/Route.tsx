import React, { useEffect, createElement } from 'react'
import { useNavigate, useLocation } from '../hooks'

interface RouteItem {
  path: string
  component: React.FC
}

export type Routes = RouteItem[]

interface RProps {
  Routes: Routes
  defaultPath?: string
}

const Route: React.FC<RProps> = (props) => {
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

export default Route
