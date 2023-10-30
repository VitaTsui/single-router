import React, { useEffect, useMemo } from 'react'
import { useLocation, useParams } from '../hooks'
import { ParamsContext, SearchContext } from '../contexts'
import formatRoute from '../_utils/formatRoute'
import getParams from '../_utils/getParams'
import isNullNode from '../_utils/isNullNode'
import getMatch from '../_utils/getMatch'

Object.defineProperty(window, 'match', {
  get: function () {
    const value = this._match ?? []

    return Object.freeze(value)
  },
  set: function (value: IRouter) {
    this._match = Object.freeze(value)
  }
})

export interface RouteProps {
  path: string
  component?: React.ReactElement | null
}

const Route: React.FC<RouteProps> = (props) => {
  const { path, component, paramKeys } = formatRoute(props)
  const { pathname, search, index } = useLocation()
  const params = useParams()

  const isNull = useMemo(
    () => isNullNode({ location: pathname, path, paramKeys, match: window.match, params }),
    [pathname, paramKeys, params, path]
  )

  useEffect(() => {
    getMatch({ match: window.match, path, basicName: pathname, paramKeys })
  }, [path, pathname, paramKeys])

  const _params = useMemo(() => getParams(pathname, paramKeys), [pathname, paramKeys])

  const _search = useMemo(() => search[index], [search, index])

  if (isNull) return null

  return (
    <ParamsContext.Provider value={{ params: _params }}>
      <SearchContext.Provider value={{ search: _search }}>{component}</SearchContext.Provider>
    </ParamsContext.Provider>
  )
}

export default Route
