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

/** 纯函数：基于当前状态计算 push 后的新状态 */
export default function push(state: IRouter, pathname: string, options?: PushOptions): IRouter {
  const _pathname = pathname.split('?')[0]
  const _search = getSearch(pathname)

  const { history, search, index } = state

  if (options?.replace) {
    if (index === -1) {
      // 空历史，直接写入第一条
      return {
        index: 0,
        pathname: _pathname,
        history: [_pathname],
        search: [_search]
      }
    }

    const newHistory = [...history]
    const newSearch = [...search]
    newHistory.splice(index, 1, _pathname)
    newSearch.splice(index, 1, _search)
    return {
      index,
      pathname: _pathname,
      history: newHistory,
      search: newSearch
    }
  }

  // 如果目标路径已存在于历史中，回退到该位置并截断后续历史
  const existingIndex = history.indexOf(_pathname)
  if (existingIndex !== -1) {
    return {
      pathname: _pathname,
      history: history.slice(0, existingIndex + 1),
      search: search.slice(0, existingIndex + 1),
      index: existingIndex
    }
  }

  // 常规 push：若不在末尾则截断后续再追加，否则直接追加
  const shouldTruncate = index !== history.length - 1 && index >= 0
  const newHistory = shouldTruncate ? history.slice(0, index + 1) : [...history]
  const newSearch = shouldTruncate ? search.slice(0, index + 1) : [...search]
  newHistory.push(_pathname)
  newSearch.push(_search)

  return {
    pathname: _pathname,
    history: newHistory,
    index: newHistory.length - 1,
    search: newSearch
  }
}
