import { useEffect, useState } from 'react'
import { Routes } from '../../components'

interface IFRoutes {
  path: string
  component: React.ReactNode
  paramKeys: Array<string>
}

export default function useRoutesFormat(routes: Routes): Array<IFRoutes> {
  const [_routes, setRoutes] = useState<IFRoutes[]>([])

  useEffect(() => {
    const _routes: IFRoutes[] = []

    routes.forEach((route) => {
      const { path, component, children } = route
      const _path = path.replace(/(\/):(\w+)/gi, '')
      const paramKeys = (path.match(/:(\w+)/g) || []).map((key: string) => key.split(':')[1])

      const _route: IFRoutes = {
        component,
        path: _path,
        paramKeys: paramKeys
      }
      _routes.push(_route)

      if (children) {
        const __routes = useRoutesFormat(children)
        _routes.push(...__routes)
      }

      setRoutes(_routes)
    })
  }, [routes])

  return _routes
}
