import { RouteProps } from '../components/Route'

interface Route {
  path: string
  component?: React.ReactElement | null
  paramKeys: Array<string>
}

export default function formatRoute(route: RouteProps): Route {
  const { path, component } = route

  let _path = path.replace(/(\/):(\w+)/gi, '')
  if (!_path.startsWith('/')) _path = `/${_path}`

  const paramKeys = (path.match(/:(\w+)/g) || []).map((key: string) => key.split(':')[1])

  const _route: Route = {
    component,
    path: _path,
    paramKeys: paramKeys
  }

  return _route
}
