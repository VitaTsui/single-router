/// <reference types="../typing" />

import { Equal } from 'hsu-utils'

export interface PushOptions {
  replace?: boolean
}

function getSearch(pathname: string) {
  const _search = pathname.split('?')[1]
  const search: Search = {}
  if (_search) {
    for (const item of _search.split('&')) {
      const key = item.split('=')[0]
      const value = item.split('=')[1]
      if (!key || !value) {
        continue
      }
      search[key] = JSON.parse(value)
    }
  }
  return search
}

export default function push(pathname: string, options?: PushOptions) {
  if (options?.replace) {
    const _pathname = pathname.split('?')[0]
    const _search = getSearch(pathname)

    window.router = {
      index: 1,
      pathname: _pathname,
      history: ['/', _pathname],
      search: [{}, _search]
    }

    return
  }

  const { history, index, search } = window.router

  const lastHistory = history[index]
  const _pathname = pathname.split('?')[0]
  const _search = getSearch(pathname)

  if (lastHistory !== _pathname) {
    history.push(_pathname)

    search.push(_search)

    window.router = {
      pathname: _pathname,
      history,
      index: history.length - 1,
      search
    }
  } else if (!Equal.ObjEqual(search[index], _search)) {
    search[index] = _search

    window.router = {
      ...window.router,
      search
    }
  }
}
