/// <reference types="../typing" />

import { createContext } from 'react'
import { Navigator } from '../history'

export const NavigationContext = createContext<{ navigator: Navigator }>(null!)

export const LocationContext = createContext<{ location: IRouter }>(null!)

export const ParamsContext = createContext<{ params: Params }>(null!)
