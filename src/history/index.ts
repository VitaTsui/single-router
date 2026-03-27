import { deepCopy } from 'hsu-utils'
import go, { GoOptions } from './_go'
import push, { PushOptions } from './_push'

export interface Navigator {
  go(delta: number, options?: GoOptions): void
  push(to: string, options?: PushOptions): void
}

const ROUTER_STORAGE_KEY = 'single-router:state'

Object.defineProperty(window, 'router', {
  get: function () {
    const stored = localStorage.getItem(ROUTER_STORAGE_KEY)
    const value: IRouter = stored
      ? JSON.parse(stored)
      : {
          pathname: '/',
          history: [],
          search: [],
          index: -1
        }

    return Object.freeze(value)
  },
  set: function (value: IRouter) {
    const copied = deepCopy(value)
    const customEvent = new CustomEvent<IRouter>('routerChange', {
      detail: Object.freeze(copied),
      bubbles: false
    })
    window.dispatchEvent(customEvent)

    localStorage.setItem(ROUTER_STORAGE_KEY, JSON.stringify(copied))
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
