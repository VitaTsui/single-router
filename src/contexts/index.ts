/// <reference types="../typing" />

import { createContext } from 'react'
import { Navigator, createHistory } from '../history'

export const NavigationContext = createContext<{ navigator: Navigator }>({ navigator: createHistory() })

export const LocationContext = createContext<{ location: IRouter }>({ location: window.router })

export const ParamsContext = createContext<{ params: Params }>({ params: {} })

export const SearchContext = createContext<{ search: Search }>({ search: {} })
