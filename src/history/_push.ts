/// <reference types="../typing" />

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

      try {
        search[key] = JSON.parse(value)
      } catch {
        search[key] = value
      }
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

  const { history, search, index } = window.router

  const _pathname = pathname.split('?')[0]
  const _search = getSearch(pathname)

  if (index !== history.length - 1) {
    history.splice(index + 1, history.length, _pathname)
    search.splice(index + 1, history.length, _search)
  } else {
    history.push(_pathname)
    search.push(_search)
  }

  window.router = {
    pathname: _pathname,
    history,
    index: history.length - 1,
    search
  }
}
