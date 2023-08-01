import React, { useState, useMemo, useEffect } from 'react'
import { NavigationContext, LocationContext } from '../contexts'
import { createHistory } from '../history'

interface RSProps {
  children?: React.ReactNode
}

const SingleRouter: React.FC<RSProps> = (props) => {
  const { children } = props
  const [location, setLocation] = useState<IRouter>(window.router)

  const locationContext = useMemo(() => {
    return { location: location }
  }, [location])

  const setLocalEvent = (e: Event) => {
    const location = (e as CustomEvent).detail
    setLocation(location)
  }

  useEffect(() => {
    setLocation(window.router)
    window.addEventListener('routerChange', setLocalEvent)

    return () => {
      window.removeEventListener('routerChange', setLocalEvent)
    }
  }, [])

  return (
    <NavigationContext.Provider value={{ navigator: createHistory() }}>
      <LocationContext.Provider value={locationContext}>{children}</LocationContext.Provider>
    </NavigationContext.Provider>
  )
}

export default SingleRouter
