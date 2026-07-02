/// <reference types="../typing" />

export interface GoOptions {
  replace?: boolean
}

/** 纯函数：基于当前状态计算 go 后的新状态；越界时返回原状态 */
export default function go(state: IRouter, delta: number, options?: GoOptions): IRouter {
  const { history, index, search } = state

  const _index = index + delta

  if (_index > history.length - 1 || _index < 0) {
    return state
  }

  const _pathname = history[_index]

  let _history = history
  let _search = search
  if (options?.replace) {
    _history = history.slice(0, _index + 1)
    _search = search.slice(0, _index + 1)
  }

  return {
    pathname: _pathname,
    history: _history,
    search: _search,
    index: _index
  }
}
