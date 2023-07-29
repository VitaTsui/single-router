import React, { useEffect } from 'react'
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
  const navigate = useNavigate()
  const location = useLocation()
  const _routes = useRoutesFormat(Routes)

  useEffect(() => {
    if (defaultPath) {
      navigate(defaultPath)
    }
  }, [])

  const params = (location: string, paramKeys: string[]): Record<string, string | undefined> => {
    let _locationPart = location.split('/')
    _locationPart = _locationPart.slice(_locationPart.length - paramKeys.length, _locationPart.length)
    const _params = paramKeys.reduce((acc: Record<string, string | undefined>, cur, idx) => {
      acc[cur] = _locationPart[idx]
      return acc
    }, {} as Record<string, string | undefined>)
    return _params
  }

  const isNull = (location: string, path: string, paramKeys: string[]): boolean => {
    let isNull = false
    isNull = !location.includes(path)
    if (!isNull) {
      const _locationPart = location.split('/')
      const _pathPart = path.split('/')
      if (_locationPart.length !== _pathPart.length + paramKeys.length) {
        isNull = true
      }
    }
    return isNull
  }

  return (
    <>
      {_routes.map((route, idx) => {
        const { path, paramKeys, component } = route
        const _location = location.route

        const _isNull = isNull(_location, path, paramKeys)
        if (_isNull) return null

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
