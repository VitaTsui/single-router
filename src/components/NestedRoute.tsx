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
 * Strips dynamic segments (/:param) from the path, yielding the static part used for prefix matching.
 * e.g. /users/:id/posts → /users/posts
 */
function getStaticPath(path: string): string {
  return path.replace(/(\/):(\w+)/gi, '')
}

/**
 * Extracts the keys of all dynamic params in the path.
 * e.g. /users/:id/posts/:postId → ['id', 'postId']
 */
function getParamKeys(path: string): string[] {
  return (path.match(/:(\w+)/g) || []).map((k) => k.slice(1))
}

/**
 * Checks whether pathname falls within the scope of pattern (with param placeholders), using segment-level prefix matching.
 * When exact is true, the segment counts must match exactly.
 */
function matchPattern(pathname: string, pattern: string, exact: boolean): boolean {
  const patternParts = pattern.split('/').filter(Boolean)
  const locationParts = pathname.split('/').filter(Boolean)

  if (exact ? locationParts.length !== patternParts.length : locationParts.length < patternParts.length) {
    return false
  }

  return patternParts.every((part, i) => part.startsWith(':') || part === locationParts[i])
}

/** Builds the child route's full path following formatRoutes semantics: kept as-is if it already contains the parent path, otherwise parent path + child path */
function resolveChildPath(parentPath: string, childPath: string): string {
  if (childPath.includes(parentPath)) return childPath
  return `${parentPath}${childPath.startsWith('/') ? '' : '/'}${childPath}`
}

/** No child routes exist below a leaf route: seal OutletContext so a misused <Outlet/> inside a leaf cannot read itself and recurse */
const EMPTY_OUTLET = { element: null }

const NestedRoute: React.FC<NestedRouteProps> = ({ path: parentPath, element, routes }) => {
  const { pathname, search, index } = useLocation()

  // Normalize the parent path (leading /, keeping dynamic segments for matching and param extraction)
  const rawParent = useMemo(() => (parentPath.startsWith('/') ? parentPath : `/${parentPath}`), [parentPath])

  // Check whether the current pathname is within the parent route's scope
  const isUnder = useMemo(() => matchPattern(pathname, rawParent, false), [pathname, rawParent])

  // Dynamic params on the parent path (provided to the parent element and index child routes)
  const parentParams = useMemo(() => getParamsByPattern(pathname, rawParent), [pathname, rawParent])

  // Find the matching direct child route and return its render element
  const outletElement = useMemo((): React.ReactElement | null => {
    if (!isUnder) return null

    const parentParts = rawParent.split('/').filter(Boolean)
    const locationParts = pathname.split('/').filter(Boolean)

    for (const child of routes) {
      // ── Index route: segment count exactly equals the parent path's ──────
      if (child.index) {
        if (locationParts.length === parentParts.length) {
          return <OutletContext.Provider value={EMPTY_OUTLET}>{child.element ?? null}</OutletContext.Provider>
        }
        continue
      }

      if (!child.path) continue

      const childPath = resolveChildPath(rawParent, child.path)

      // ── Intermediate route with children: prefix match, recurse into NestedRoute ──
      if (child.children) {
        if (matchPattern(pathname, childPath, false)) {
          return <NestedRoute path={childPath} element={child.element} routes={child.children} />
        }
        continue
      }

      // ── Leaf route: exact match ─────────────────────────────────────────
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
