import React, { useState, useMemo, useEffect } from 'react'
import { NavigationContext, LocationContext } from '../contexts'
import { createHistory } from '../history'
import PathBar from './_PathBar'

interface RSProps {
  children?: React.ReactNode
  showPath?: boolean
}

const SingleRouter: React.FC<RSProps> = (props) => {
  const { children, showPath = true } = props
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
      <LocationContext.Provider value={locationContext}>
        {process.env.NODE_ENV === 'development' && showPath && <PathBar />}
        {children}
      </LocationContext.Provider>
    </NavigationContext.Provider>
  )
}

export default SingleRouter
