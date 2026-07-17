import React, { useMemo, useSyncExternalStore } from 'react'
import { RouterContext, LocationContext } from '../contexts'
import { RouterStore, defaultRouterStore } from '../history'
import PathBar from './_PathBar'

interface RSProps {
  children?: React.ReactNode
  /** Whether to show the path bar in development; isolate instances hide it by default (multiple instances would overlap each other) */
  showPath?: boolean
  /**
   * Router isolation: creates independent routing state for this route tree,
   * unaffected by other SingleRouter instances (including the default global one).
   */
  isolate?: boolean
  /**
   * Persistence key when isolate is enabled (stored in localStorage as 'single-router:state:<persistKey>');
   * if omitted, the isolated state lives only in memory and is lost on unmount.
   */
  persistKey?: string
  /** Initial path when isolate is enabled, defaults to '/' */
  initialPath?: string
}

/**
 * Router container. By default all SingleRouter instances share the same global routing state (persisted to localStorage);
 * with isolate enabled it holds its own routing state, suitable for embedding a local router inside a page / modal.
 */
const SingleRouter: React.FC<RSProps> = (props) => {
  const { children, isolate = false, persistKey, initialPath, showPath = !isolate } = props

  // The isolate config only takes effect on first mount; the store never switches during the instance's lifetime
  const store = useMemo(() => {
    if (!isolate) return defaultRouterStore

    return new RouterStore({
      persistKey: persistKey ? `single-router:state:${persistKey}` : undefined,
      initialPath
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const location = useSyncExternalStore(store.subscribe, store.getState)

  const locationContext = useMemo(() => {
    return { location }
  }, [location])

  return (
    <RouterContext.Provider value={store}>
      <LocationContext.Provider value={locationContext}>
        {process.env.NODE_ENV === 'development' && showPath && <PathBar />}
        {children}
      </LocationContext.Provider>
    </RouterContext.Provider>
  )
}

export default SingleRouter
