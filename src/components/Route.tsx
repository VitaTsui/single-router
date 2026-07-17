import React, { useContext, useEffect, useMemo, useSyncExternalStore } from 'react'
import { useLocation, useParams } from '../hooks'
import { ParamsContext, RouterContext, SearchContext } from '../contexts'
import formatRoute from '../_utils/formatRoute'
import getParams from '../_utils/getParams'
import isNullNode from '../_utils/isNullNode'
import setMatch from '../_utils/setMatch'

export interface RouteProps {
  /** Full route path (supports :param dynamic segments), e.g. '/users/:id' */
  path: string
  /** Element rendered when the path matches */
  element?: React.ReactElement | null
}

/**
 * Declares a route: renders element when the current path matches path, otherwise renders null.
 * Nested routes are written inside child components and loaded in place; they can also be generated from a config tree via useRoutes.
 */
const Route: React.FC<RouteProps> = (props) => {
  const { path, element, paramKeys } = formatRoute(props)
  const store = useContext(RouterContext)
  const { pathname, search, index } = useLocation()
  const params = useParams()
  const refresh = useSyncExternalStore(store.subscribe, store.getRefreshing)

  const isNull = useMemo(
    () => isNullNode({ location: pathname, path, paramKeys, match: store.getMatch(), params, refresh }),
    [pathname, paramKeys, params, path, refresh, store]
  )

  useEffect(() => {
    store.setMatch(setMatch({ match: store.getMatch(), path, basicName: pathname, paramKeys }))
  }, [path, pathname, paramKeys, store])

  const _params = useMemo(() => getParams(pathname, paramKeys), [pathname, paramKeys])

  const _search = useMemo(() => search[index], [search, index])

  if (isNull) return null

  return (
    <ParamsContext.Provider value={{ params: _params }}>
      <SearchContext.Provider value={{ search: _search }}>{element}</SearchContext.Provider>
    </ParamsContext.Provider>
  )
}

export default Route
