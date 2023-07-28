import React, { useState, useMemo, useEffect } from 'react'
import { NavigationContext, LocationContext } from '../contexts'
import { createHistory, Navigator } from '../history'

interface RSProps {
  children?: React.ReactNode
}

const Router: React.FC<RSProps> = (props) => {
  const { children } = props
  const [local, setLocal] = useState<IRouter>({
    route: '',
    routes: [],
    index: 0
  })

  const historyRef = React.useRef<Navigator>()
  if (historyRef.current == null) {
    historyRef.current = createHistory()
  }
  const history = historyRef.current
  const navigator = history
  const navigationContext = useMemo(() => ({ navigator }), [navigator])

  const locationContext = useMemo(() => {
    return { location: local }
  }, [local])

  const setLocation = () => {
    const local = window.router

    setLocal(local)
  }

  useEffect(() => {
    window.addEventListener('router', setLocation)

    return () => {
      window.removeEventListener('router', setLocation)
    }
  }, [])

  return (
    <NavigationContext.Provider value={navigationContext}>
      <LocationContext.Provider value={locationContext}>{children}</LocationContext.Provider>
    </NavigationContext.Provider>
  )
}

export default Router
