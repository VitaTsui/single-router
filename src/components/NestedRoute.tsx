/// <reference types="../typing" />

import React, { useMemo } from 'react'
import { useLocation } from '../hooks'
import { OutletContext, ParamsContext, SearchContext } from '../contexts'
import { getParamsByPattern } from '../_utils/getParams'
import { Routes } from '../hooks/useRoutes'

export interface NestedRouteProps {
  path: string
  element?: React.ReactElement | null
  routes: Routes
}

/**
 * 将路径中的动态段（/:param）去掉，得到用于前缀匹配的静态部分。
 * 例：/users/:id/posts → /users/posts
 */
function getStaticPath(path: string): string {
  return path.replace(/(\/):(\w+)/gi, '')
}

/**
 * 提取路径中所有动态参数的 key。
 * 例：/users/:id/posts/:postId → ['id', 'postId']
 */
function getParamKeys(path: string): string[] {
  return (path.match(/:(\w+)/g) || []).map((k) => k.slice(1))
}

/**
 * 判断 pathname 是否落在 pattern（含参数占位符）的范围内（段级前缀匹配）。
 * exact 为 true 时要求段数完全一致。
 */
function matchPattern(pathname: string, pattern: string, exact: boolean): boolean {
  const patternParts = pattern.split('/').filter(Boolean)
  const locationParts = pathname.split('/').filter(Boolean)

  if (exact ? locationParts.length !== patternParts.length : locationParts.length < patternParts.length) {
    return false
  }

  return patternParts.every((part, i) => part.startsWith(':') || part === locationParts[i])
}

/** 按 formatRoutes 的语义拼出子路由完整路径：已含父路径则原样，否则父路径 + 子路径 */
function resolveChildPath(parentPath: string, childPath: string): string {
  if (childPath.includes(parentPath)) return childPath
  return `${parentPath}${childPath.startsWith('/') ? '' : '/'}${childPath}`
}

/** 叶子路由之下不再有子路由：封住 OutletContext，防止叶子里误用 <Outlet/> 时读到自身造成递归 */
const EMPTY_OUTLET = { element: null }

const NestedRoute: React.FC<NestedRouteProps> = ({ path: parentPath, element, routes }) => {
  const { pathname, search, index } = useLocation()

  // 规范化父路径（以 / 开头，保留动态段用于匹配与取参）
  const rawParent = useMemo(() => (parentPath.startsWith('/') ? parentPath : `/${parentPath}`), [parentPath])

  // 判断当前 pathname 是否在父路由的范围内
  const isUnder = useMemo(() => matchPattern(pathname, rawParent, false), [pathname, rawParent])

  // 父路径上的动态参数（提供给父 element 及 index 子路由）
  const parentParams = useMemo(() => getParamsByPattern(pathname, rawParent), [pathname, rawParent])

  // 找到匹配的直接子路由，返回对应的渲染元素
  const outletElement = useMemo((): React.ReactElement | null => {
    if (!isUnder) return null

    const parentParts = rawParent.split('/').filter(Boolean)
    const locationParts = pathname.split('/').filter(Boolean)

    for (const child of routes) {
      // ── index 路由：与父路径段数完全一致 ──────────────────────────────
      if (child.index) {
        if (locationParts.length === parentParts.length) {
          return <OutletContext.Provider value={EMPTY_OUTLET}>{child.element ?? null}</OutletContext.Provider>
        }
        continue
      }

      if (!child.path) continue

      const childPath = resolveChildPath(rawParent, child.path)

      // ── 含 children 的中间路由：前缀匹配，递归交给 NestedRoute ────────
      if (child.children) {
        if (matchPattern(pathname, childPath, false)) {
          return <NestedRoute path={childPath} element={child.element} routes={child.children} />
        }
        continue
      }

      // ── 叶子路由：精确匹配 ──────────────────────────────────────────
      if (matchPattern(pathname, childPath, true)) {
        const params = getParamsByPattern(pathname, childPath)
        return (
          <OutletContext.Provider value={EMPTY_OUTLET}>
            <ParamsContext.Provider value={{ params }}>{child.element ?? null}</ParamsContext.Provider>
          </OutletContext.Provider>
        )
      }
    }

    return null
  }, [isUnder, pathname, routes, rawParent])

  const outletState = useMemo(() => ({ element: outletElement }), [outletElement])

  if (!isUnder) return null

  const _search = search[index] ?? {}

  return (
    <OutletContext.Provider value={outletState}>
      <ParamsContext.Provider value={{ params: parentParams }}>
        <SearchContext.Provider value={{ search: _search }}>{element}</SearchContext.Provider>
      </ParamsContext.Provider>
    </OutletContext.Provider>
  )
}

export default NestedRoute
