/// <reference types="../typing" />

import React, { createContext } from 'react'
import { RouterStore, defaultRouterStore } from '../history'

/** The store the current route tree belongs to (per-instance under isolate, otherwise the global default) */
export const RouterContext = createContext<RouterStore>(defaultRouterStore)

export const LocationContext = createContext<{ location: IRouter }>({ location: defaultRouterStore.getState() })

export const ParamsContext = createContext<{ params: Params }>({ params: {} })

export const SearchContext = createContext<{ search: Search }>({ search: {} })

export interface OutletState {
  element: React.ReactElement | null
}

/** The child route to render at the current level (provided by NestedRoute, consumed by Outlet) */
export const OutletContext = createContext<OutletState>({ element: null })

/** The value <Outlet context={...}> passes down to child routes (consumed by useOutletContext) */
export const OutletValueContext = createContext<unknown>(undefined)
