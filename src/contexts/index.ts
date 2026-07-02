/// <reference types="../typing" />

import React, { createContext } from 'react'
import { RouterStore, defaultRouterStore } from '../history'

/** 当前路由树所属的 store（isolate 时为实例级，否则为全局默认） */
export const RouterContext = createContext<RouterStore>(defaultRouterStore)

export const LocationContext = createContext<{ location: IRouter }>({ location: defaultRouterStore.getState() })

export const ParamsContext = createContext<{ params: Params }>({ params: {} })

export const SearchContext = createContext<{ search: Search }>({ search: {} })

export interface OutletState {
  element: React.ReactElement | null
}

/** 当前层级待渲染的子路由（由 NestedRoute 提供，Outlet 消费） */
export const OutletContext = createContext<OutletState>({ element: null })

/** <Outlet context={...}> 透传给子路由的值（useOutletContext 消费） */
export const OutletValueContext = createContext<unknown>(undefined)
