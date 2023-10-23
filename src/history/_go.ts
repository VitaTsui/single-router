/// <reference types="../typing" />

export interface GoOptions {
  replace?: boolean
}

export default function go(delta: number, options?: GoOptions) {
  const { history, index, search } = window.router

  const _index = index + delta

  if (_index > history.length - 1 || _index < 0) {
    return
  }

  const _pathname = history[_index]

  let _history = history
  let _search = search
  if (options?.replace) {
    _history = history.slice(0, _index + 1)
    _search = _search.slice(0, _index + 1)
  }

  window.router = {
    pathname: _pathname,
    history: _history,
    search: _search,
    index: _index
  }
}
