import React, { useMemo } from 'react'
import { useLocation, useMatch } from '../hooks'
import { MatchContext, ParamsContext } from '../contexts'
import formatRoute from '../_utils/formatRoute'
import getParams from '../_utils/getParams'
import isNullNode from '../_utils/isNullNode'
import setMatch from '../_utils/setMatch'

export interface RouteProps {
  path: string
  component: React.ReactNode
}

const Route: React.FC<RouteProps> = (props) => {
  const { path, component, paramKeys } = formatRoute(props)
  const location = useLocation()?.route
  const match = useMatch()

  const isNull = useMemo(() => isNullNode({ location, path, paramKeys, match }), [location])
  if (isNull) return null

  const _params = useMemo(() => getParams(location, paramKeys), [location])

  const _match = useMemo(() => setMatch(match, paramKeys, path), [match])

  return (
    <MatchContext.Provider value={{ match: _match }}>
      <ParamsContext.Provider value={{ params: _params }} children={component} />
    </MatchContext.Provider>
  )
}

export default Route
