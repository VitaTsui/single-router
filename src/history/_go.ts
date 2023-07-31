/// <reference types="../typing" />

export default function go(delta: number) {
  const { history, index } = window.router

  let _index = index + delta

  if (_index > index) {
    _index = index
  }

  if (_index < -1) {
    _index = -1
  }

  const _pathname = _index === -1 ? '' : history[_index]
  const _history = _index === -1 ? [] : history.slice(0, _index + 1)

  window.router = {
    pathname: _pathname,
    history: _history,
    index: _index
  }
}
