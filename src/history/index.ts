/// <reference types="../typing" />

import go, { GoOptions } from './_go'
import push, { PushOptions } from './_push'

export interface Navigator {
  go(delta: number, options?: GoOptions): void
  push(to: string, options?: PushOptions): void
}

export interface RouterStoreOptions {
  /** 持久化到 localStorage 的 key；不传则路由状态只存在内存中 */
  persistKey?: string
  /** 初始路径，默认 '/' */
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
 * 路由状态容器：每个实例持有独立的 pathname/history/search/match/refreshing，
 * 互不影响（路由隔离的基础）。通过 subscribe 订阅变更。
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
    // 路由变化后重新收集 match（Route 挂载时重建）
    this._match = []

    if (this._persistKey) {
      try {
        localStorage.setItem(this._persistKey, JSON.stringify(state))
      } catch {
        // 持久化失败不影响路由本身
      }
    }

    this._emit()
  }

  getMatch = (): Match => this._match

  setMatch = (match: Match) => {
    this._match = match
  }

  /** 刷新当前路由：已匹配的 Route 卸载 300ms 后重新挂载，模拟页面刷新 */
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
 * 默认全局 store：不带 isolate 的 <SingleRouter> 共享它，
 * 并沿用 localStorage 持久化（与历史版本行为一致）。
 */
export const defaultRouterStore = new RouterStore({ persistKey: DEFAULT_STORAGE_KEY })

/** 组件树外导航（如 store 中跳转）：作用于默认全局 store */
export const routerHistory: Navigator = defaultRouterStore.navigator
