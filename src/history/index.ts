import go from './_go'
import push, { NavigateOptions } from './_push'
import { Equal } from 'hsu-utils'

export interface Navigator {
  go(delta: number): void
  push(to: string, options?: NavigateOptions): void
}

Object.defineProperty(window, 'router', {
  get: function () {
    const value = this._router ?? {
      pathname: '',
      history: [],
      index: 0
    }

    return Object.freeze(value)
  },
  set: function (value: IRouter) {
    if (!this._router || !Equal.ObjEqual(this._router, value)) {
      const customEvent = new CustomEvent<IRouter>('routerChange', {
        detail: value,
        bubbles: false
      })
      window.dispatchEvent(customEvent)

      this._router = Object.freeze(value)
    }
  }
})

Object.defineProperty(window, 'match', {
  get: function () {
    const value = this._match ?? []

    return Object.freeze(value)
  },
  set: function (value: IRouter) {
    this._match = Object.freeze(value)
  }
})

export function createHistory(): Navigator {
  const history: Navigator = {
    go,
    push
  }

  return history
}
