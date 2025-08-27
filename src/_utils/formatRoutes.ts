import { Equal } from 'hsu-utils'
import { PathRoutes, Routes } from '../hooks'

export default function formatRoutes(routes: Routes, parent?: string): PathRoutes[] {
  const _routes: PathRoutes[] = []

  const _index = routes.filter((route) => route?.index)
  if (!parent && !!_index.length) {
    throw new Error("'index' not allowed in first level menu.")
  }

  routes.forEach((route) => {
    const { children, path, index, element } = route

    if (children) {
      const _index = children.filter((route) => route?.index)
      if (_index.length > 1) {
        throw new Error("'index' route must be only one.")
      } else if (!!_index.length && _index[0]?.path) {
        throw new Error("'index' and 'path' are not allowed at the same time.")
      }

      const _path = parent
        ? path?.includes(parent)
          ? path
          : `${parent}${path?.startsWith('/') ? '' : path ? '/' : ''}${path ?? ''}`
        : path

      if (!_index.length && _path) {
        const _route: PathRoutes = {
          ...route,
          path: _path
        }
        _routes.push(_route)
      }

      const __routes: PathRoutes[] = formatRoutes(children, _path)
      _routes.push(...__routes)
    } else if (index && parent) {
      const _route: PathRoutes = {
        path: parent,
        element
      }
      _routes.push(_route)
    } else if (!index) {
      const _path = parent
        ? path.includes(parent)
          ? path
          : `${parent}${path.startsWith('/') ? '' : '/'}${path}`
        : path

      const _route = {
        ...route,
        path: _path
      }

      _routes.push(_route)
    }
  })

  return _routes.filter((item, index, arr) => {
    return Equal.ValEqual(
      arr.findIndex((v) => v.path === item.path, 0),
      index
    )
  })
}
