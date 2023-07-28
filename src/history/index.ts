import go from './_go'
import push, { NavigateOptions } from './_push'

export interface Navigator {
  go(delta: number): void
  push(to: string, options?: NavigateOptions): void
}

export function createHistory(): Navigator {
  if (!window.router) {
    window.router = {
      route: '',
      routes: [],
      index: 0
    }
    Object.defineProperty(window, 'router', {
      get: function () {
        return (
          this._router ?? {
            route: '',
            routes: [],
            index: 0
          }
        )
      },
      set: function (value) {
        this._router = value
      }
    })
  }

  const history: Navigator = {
    go,
    push
  }

  return history
}
