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
  const _pathname = pathname.split('?')[0]
  const _search = getSearch(pathname)

  const { history, search, index } = window.router

  if (options?.replace) {
    if (index === -1) {
      // 空历史，直接写入第一条
      window.router = {
        index: 0,
        pathname: _pathname,
        history: [_pathname],
        search: [_search]
      }
    } else {
      const newHistory = [...history]
      const newSearch = [...search]
      newHistory.splice(index, 1, _pathname)
      newSearch.splice(index, 1, _search)
      window.router = {
        index,
        pathname: _pathname,
        history: newHistory,
        search: newSearch
      }
    }
    return
  }

  // 如果目标路径已存在于历史中，回退到该位置并截断后续历史
  const existingIndex = history.indexOf(_pathname)
  if (existingIndex !== -1) {
    window.router = {
      pathname: _pathname,
      history: history.slice(0, existingIndex + 1),
      search: search.slice(0, existingIndex + 1),
      index: existingIndex
    }
    return
  }

  // 常规 push：若不在末尾则截断后续再追加，否则直接追加
  if (index !== history.length - 1 && index >= 0) {
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
