/// <reference types="../typing" />

import go, { GoOptions } from './_go'
import push, { PushOptions } from './_push'

/** Navigator: go moves forward / backward, push navigates to a given path */
export interface Navigator {
  go(delta: number, options?: GoOptions): void
  push(to: string, options?: PushOptions): void
}

export interface RouterStoreOptions {
  /** localStorage key for persistence; if omitted, routing state lives only in memory */
  persistKey?: string
  /** Initial path, defaults to '/' */
  initialPath?: string
}

const DEFAULT_STORAGE_KEY = 'single-router:state'

function readPersisted(persistKey: string): IRouter | null {
  try {
    const stored = localStorage.getItem(persistKey)
    if (!stored) return null
    const value = JSON.parse(stored) as IRouter
    if (typeof value?.pathname !== 'string' || !Array.isArray(value?.history)) return null
    return value
  } catch {
    return null
  }
}

/**
 * Routing state container: each instance holds its own pathname/history/search/match/refreshing,
 * independent of the others (the basis of router isolation). Subscribe to changes via subscribe.
 */
export class RouterStore {
  private _state: IRouter
  private _match: Match = []
  private _refreshing = false
  private _listeners = new Set<() => void>()
  private _persistKey?: string

  readonly navigator: Navigator

  constructor(options: RouterStoreOptions = {}) {
    const { persistKey, initialPath = '/' } = options
    this._persistKey = persistKey

    const persisted = persistKey ? readPersisted(persistKey) : null
    this._state = Object.freeze(
      persisted ?? {
        pathname: initialPath,
        history: [],
        search: [],
        index: -1
      }
    ) as IRouter

    this.navigator = {
      push: (to, options) => this.setState(push(this._state, to, options)),
      go: (delta, options) => this.setState(go(this._state, delta, options))
    }
  }

  getState = (): IRouter => this._state

  getRefreshing = (): boolean => this._refreshing

  setState = (state: IRouter) => {
    if (state === this._state) return

    this._state = Object.freeze(state) as IRouter
    // Re-collect match after a route change (rebuilt when Route components mount)
    this._match = []

    if (this._persistKey) {
      try {
        localStorage.setItem(this._persistKey, JSON.stringify(state))
      } catch {
        // Persistence failures do not affect routing itself
      }
    }

    this._emit()
  }

  getMatch = (): Match => this._match

  setMatch = (match: Match) => {
    this._match = match
  }

  /** Reload the current route: matched Routes unmount and remount after 300ms, simulating a page refresh */
  reload = () => {
    this._refreshing = true
    this._emit()

    setTimeout(() => {
      this._refreshing = false
      this._emit()
    }, 300)
  }

  subscribe = (listener: () => void): (() => void) => {
    this._listeners.add(listener)
    return () => {
      this._listeners.delete(listener)
    }
  }

  private _emit = () => {
    this._listeners.forEach((listener) => listener())
  }
}

/**
 * Default global store: shared by all <SingleRouter> instances without isolate,
 * with routing state persisted to localStorage.
 */
export const defaultRouterStore = new RouterStore({ persistKey: DEFAULT_STORAGE_KEY })

/** Navigation outside the component tree (e.g. from a store): operates on the default global store */
export const routerHistory: Navigator = defaultRouterStore.navigator
