import React, { useMemo } from 'react'
import { useLocation, useMatch, useParams } from '../hooks'
import { MatchContext, ParamsContext } from '../contexts'
import formatRoute from '../_utils/formatRoute'
import getParams from '../_utils/getParams'
import isNullNode from '../_utils/isNullNode'
import setMatch from '../_utils/setMatch'

export interface RouteProps {
  path: string
  component: React.ReactElement
}

const Route: React.FC<RouteProps> = (props) => {
  const { path, component, paramKeys } = formatRoute(props)
  const location = useLocation()?.route
  const params = useParams()
  const match = useMatch()

  const isNull = useMemo(
    () => isNullNode({ location, path, paramKeys, match, params }),
    [location, match, paramKeys, params, path]
  )

  const _params = useMemo(() => (isNull ? {} : getParams(location, paramKeys)), [location, paramKeys, isNull])
  const _match = useMemo(() => (isNull ? null : setMatch(match, paramKeys, path)), [match, paramKeys, path, isNull])

  if (isNull) return null

  return (
    <MatchContext.Provider value={{ match: _match }}>
      <ParamsContext.Provider value={{ params: _params }}>{component}</ParamsContext.Provider>
    </MatchContext.Provider>
  )
}

export default Route
