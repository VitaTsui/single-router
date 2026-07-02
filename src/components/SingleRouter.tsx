import React, { useMemo, useSyncExternalStore } from 'react'
import { RouterContext, LocationContext } from '../contexts'
import { RouterStore, defaultRouterStore } from '../history'
import PathBar from './_PathBar'

interface RSProps {
  children?: React.ReactNode
  /** 开发环境是否展示路径栏；isolate 实例默认不展示（多实例会互相遮挡） */
  showPath?: boolean
  /**
   * 路由隔离：为本路由树创建独立的路由状态，
   * 与其他 SingleRouter（含默认全局实例）互不影响。
   */
  isolate?: boolean
  /**
   * isolate 下的持久化 key（存储于 localStorage 'single-router:state:<persistKey>'）；
   * 不传则隔离状态只存在内存中，卸载即消失。
   */
  persistKey?: string
  /** isolate 下的初始路径，默认 '/' */
  initialPath?: string
}

const SingleRouter: React.FC<RSProps> = (props) => {
  const { children, isolate = false, persistKey, initialPath, showPath = !isolate } = props

  // isolate 配置仅在首次挂载时生效，实例生命周期内不切换 store
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
