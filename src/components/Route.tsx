import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from '../hooks'
import { ParamsContext, SearchContext } from '../contexts'
import formatRoute from '../_utils/formatRoute'
import getParams from '../_utils/getParams'
import isNullNode from '../_utils/isNullNode'
import setMatch from '../_utils/setMatch'

export interface RouteProps {
  path: string
  component?: React.ReactElement | null
}

const Route: React.FC<RouteProps> = (props) => {
  const { path, component, paramKeys } = formatRoute(props)
  const { pathname, search, index } = useLocation()
  const params = useParams()
  const [refresh, setRefresh] = useState<boolean>(false)

  const isNull = useMemo(
    () => isNullNode({ location: pathname, path, paramKeys, match: window.match, params, refresh }),
    [pathname, paramKeys, params, path, refresh]
  )

  useEffect(() => {
    setMatch({ match: window.match, path, basicName: pathname, paramKeys })
  }, [path, pathname, paramKeys])

  const _params = useMemo(() => getParams(pathname, paramKeys), [pathname, paramKeys])

  const _search = useMemo(() => search[index], [search, index])

  useEffect(() => {
    window.addEventListener('refreshChange', (e: Event) => {
      const refresh = (e as CustomEvent).detail
      setRefresh(refresh)

      if (refresh) {
        setTimeout(() => {
          window.refresh = false
        }, 300)
      }
    })
  }, [])

  if (isNull) return null

  return (
    <ParamsContext.Provider value={{ params: _params }}>
      <SearchContext.Provider value={{ search: _search }}>{component}</SearchContext.Provider>
    </ParamsContext.Provider>
  )
}

export default Route
