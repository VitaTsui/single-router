import go, { GoOptions } from './_go'
import push, { PushOptions } from './_push'
import { Equal } from 'hsu-utils'

export interface Navigator {
  go(delta: number, options?: GoOptions): void
  push(to: string, options?: PushOptions): void
}

Object.defineProperty(window, 'router', {
  get: function () {
    const value = this._router ?? {
      pathname: '/',
      history: ['/'],
      search: [{}],
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

export function createHistory(): Navigator {
  const history: Navigator = {
    go,
    push
  }

  return history
}

export const routerHistory = createHistory()
