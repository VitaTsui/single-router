import go from './_go'
import push, { NavigateOptions } from './_push'

export interface Navigator {
  go(delta: number): void
  push(to: string, options?: NavigateOptions): void
}

Object.defineProperty(window, 'router', {
  get: function () {
    const value = this._router ?? {
      route: '',
      routes: [],
      index: 0
    }

    return Object.freeze(value)
  },
  set: function (value: IRouter) {
    const customEvent = new CustomEvent<IRouter>('routerChange', {
      detail: value,
      bubbles: false
    })
    window.dispatchEvent(customEvent)

    this._router = Object.freeze(value)
  }
})

export function createHistory(): Navigator {
  const history: Navigator = {
    go,
    push
  }

  return history
}
