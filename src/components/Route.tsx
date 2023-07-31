import React, { useMemo } from 'react'
import { useLocation, useParams } from '../hooks'
import { ParamsContext } from '../contexts'
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
  const location = useLocation()
  const params = useParams()

  const isNull = useMemo(
    () => isNullNode({ location: location?.pathname, path, paramKeys, match: window.match, params }),
    [location, paramKeys, params, path]
  )

  const _match = useMemo(
    () => getMatch({ match: window.match, path, basicName: location?.pathname, paramKeys }),
    [path, location, paramKeys]
  )
  window.match = _match

  const _params = useMemo(() => getParams(location?.pathname, paramKeys), [location, paramKeys])

  if (isNull) return null

  return <ParamsContext.Provider value={{ params: _params }}>{component}</ParamsContext.Provider>
}

export default Route
