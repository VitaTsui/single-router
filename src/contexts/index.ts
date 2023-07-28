import { createContext } from 'react'
import { Navigator } from '../history'

interface NavigationContextObject {
  navigator: Navigator
}

export const NavigationContext = createContext<NavigationContextObject>(null!)

export const LocationContext = createContext<{ location: IRouter }>(null!)

export const ParamsContext = createContext<{ params: Record<string, string | undefined> }>(null!)
