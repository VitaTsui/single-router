import React, { useState, useMemo, useEffect } from 'react'
import { NavigationContext, LocationContext } from '../contexts'
import { createHistory } from '../history'

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

  const locationContext = useMemo(() => {
    return { location: local }
  }, [local])

  const setLocalEvent = (e: Event) => {
    const local = (e as CustomEvent).detail
    setLocal(local)
  }

  useEffect(() => {
    setLocal(window.router)

    window.addEventListener('routerChange', setLocalEvent)

    return () => {
      window.removeEventListener('routerChange', setLocalEvent)
    }
  }, [])

  return (
    <NavigationContext.Provider value={{ navigator: createHistory() }}>
      <LocationContext.Provider value={locationContext} children={children} />
    </NavigationContext.Provider>
  )
}

export default Router
