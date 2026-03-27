/// <reference types="../typing" />

import React, { useMemo } from 'react'
import { useLocation } from '../hooks'
import { OutletContext, ParamsContext, SearchContext } from '../contexts'
import getParams from '../_utils/getParams'
import { Routes } from '../hooks/useRoutes'

export interface NestedRouteProps {
  path: string
  element?: React.ReactElement | null
  routes: Routes
}

/**
 * 将路径中的动态段（/:param）去掉，得到用于前缀匹配的静态部分。
 * 例：/users/:id/posts → /users
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
 * 判断 pathname 是否以 path（已去除动态段）为前缀，
 * 同时考虑参数占位符的数量。
 */
function isPrefixMatch(pathname: string, staticPath: string, paramCount: number): boolean {
  const pathParts = staticPath.split('/').filter(Boolean)
  const locationParts = pathname.split('/').filter(Boolean)
  if (locationParts.length < pathParts.length + paramCount) return false
  return pathParts.every((part, i) => part === locationParts[i])
}

/**
 * 判断 pathname 是否精确匹配 path（含参数占位符）。
 */
function isExactMatch(pathname: string, staticPath: string, paramCount: number): boolean {
  const pathParts = staticPath.split('/').filter(Boolean)
  const locationParts = pathname.split('/').filter(Boolean)
  return (
    locationParts.length === pathParts.length + paramCount &&
    pathParts.every((part, i) => part === locationParts[i])
  )
}

const NestedRoute: React.FC<NestedRouteProps> = ({ path: parentPath, element, routes }) => {
  const { pathname, search, index } = useLocation()

  // 规范化父路径（以 / 开头，去掉动态段）
  const normalizedParent = useMemo(() => {
    const raw = parentPath.startsWith('/') ? parentPath : `/${parentPath}`
    return getStaticPath(raw)
  }, [parentPath])

  const parentParamKeys = useMemo(() => getParamKeys(parentPath), [parentPath])

  // 判断当前 pathname 是否在父路由的范围内
  const isUnder = useMemo(
    () => isPrefixMatch(pathname, normalizedParent, parentParamKeys.length),
    [pathname, normalizedParent, parentParamKeys]
  )

  // 找到匹配的直接子路由，返回对应的渲染元素
  const outletElement = useMemo((): React.ReactElement | null => {
    if (!isUnder) return null

    const parentStaticParts = normalizedParent.split('/').filter(Boolean)
    const locationParts = pathname.split('/').filter(Boolean)

    for (const child of routes) {
      // ── index 路由：与父路径段数完全一致 ──────────────────────────────
      if (child.index) {
        if (locationParts.length === parentStaticParts.length + parentParamKeys.length) {
          return child.element ?? null
        }
        continue
      }

      if (!child.path) continue

      // 计算子路由完整路径
      const rawChildPath = child.path.startsWith('/')
        ? child.path
        : `${normalizedParent}/${child.path}`

      const childStatic = getStaticPath(rawChildPath)
      const childParamKeys = getParamKeys(rawChildPath)

      // ── 含 children 的中间路由：前缀匹配，递归交给 NestedRoute ────────
      if (child.children) {
        if (isPrefixMatch(pathname, childStatic, childParamKeys.length)) {
          return (
            <NestedRoute
              path={rawChildPath}
              element={child.element}
              routes={child.children}
            />
          )
        }
        continue
      }

      // ── 叶子路由：精确匹配 ──────────────────────────────────────────
      if (isExactMatch(pathname, childStatic, childParamKeys.length)) {
        const params = getParams(pathname, childParamKeys)
        return (
          <ParamsContext.Provider value={{ params }}>
            {child.element ?? null}
          </ParamsContext.Provider>
        )
      }
    }

    return null
  }, [isUnder, pathname, routes, normalizedParent, parentParamKeys])

  if (!isUnder) return null

  const _search = search[index] ?? {}

  return (
    <OutletContext.Provider value={outletElement}>
      <SearchContext.Provider value={{ search: _search }}>{element}</SearchContext.Provider>
    </OutletContext.Provider>
  )
}

export default NestedRoute
