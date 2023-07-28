import React, { useEffect, createElement, useCallback, useMemo } from 'react'
import { useNavigate, useLocation } from '../hooks'
import useRoutesFormat from '../hooks/_/useRoutesFormat'
import { ParamsContext } from '../contexts'

interface RouteItem {
  path: string
  component: React.ReactNode
  children?: RouteItem[]
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
  const _routes = useRoutesFormat(Routes)

  useEffect(() => {
    if (defaultPath) {
      navigator(defaultPath)
    }
  }, [])

  const params = useCallback((location: string, paramKeys: string[]): Record<string, string | undefined> => {
    let _locationPart = location.split('/')
    _locationPart = _locationPart.slice(_locationPart.length - paramKeys.length, _locationPart.length)
    const _params = paramKeys.reduce((acc: Record<string, string | undefined>, cur, idx) => {
      acc[cur] = _locationPart[idx]
      return acc
    }, {} as Record<string, string | undefined>)
    return _params
  }, [])

  return (
    <>
      {_routes.map((route, idx) => {
        const { path, paramKeys, component } = route
        const _location = location.route

        let isNull = !_location.includes(path)
        if (!isNull) {
          const _locationPart = _location.split('/')
          const _pathPart = path.split('/')
          if (_locationPart.length !== _pathPart.length + paramKeys.length) {
            isNull = true
          }
        }
        if (isNull) return null

        const _params = params(_location, paramKeys)

        return (
          <ParamsContext.Provider value={{ params: _params }} key={idx}>
            {component}
          </ParamsContext.Provider>
        )
      })}
    </>
  )
}

export default Route
