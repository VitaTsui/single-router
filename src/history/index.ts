export interface Navigator {
  go(delta: number): void
  push(to: string): void
}

export function createHistory(): Navigator {
  window.router = {
    route: '',
    routes: [],
    index: 0,
    path: window.location.href
  }
  Object.defineProperty(window, 'router', {
    get: function () {
      return (
        this._router ?? {
          route: '',
          routes: [],
          index: 0,
          path: window.location.href
        }
      )
    },
    set: function (value) {
      this._router = value
    }
  })

  function go(delta: number) {
    const routes = window.router.routes
    const lastLocationIndex = window.router.index
    let locationIndex = 0

    if (typeof lastLocationIndex === 'number') {
      if (lastLocationIndex === routes.length - 1) {
        if (delta < 0 && lastLocationIndex + delta >= 0) {
          locationIndex = lastLocationIndex + delta
        } else {
          locationIndex = lastLocationIndex
        }
      } else {
        if (
          (delta < 0 && lastLocationIndex + delta >= 0) ||
          (delta > 0 && lastLocationIndex + delta <= routes.length - 1)
        ) {
          locationIndex = lastLocationIndex + delta
        }
      }
    }

    const location = routes[locationIndex]

    window.router = {
      route: location,
      routes: routes,
      index: locationIndex,
      path: window.location.href
    }
  }

  function push(path: string) {
    const routes = window.router.routes
    const location = path
    const locationIndex = routes.indexOf(location)

    if (routes.length > 0 && locationIndex !== -1 && locationIndex !== routes.length - 1) {
      window.router = {
        route: location,
        routes: routes.slice(0, locationIndex + 1),
        index: locationIndex,
        path: window.location.href
      }
    } else if (routes.length > 0) {
      if (path !== routes[routes.length - 1]) {
        routes.push(path)
      }

      window.router = {
        route: location,
        routes: routes,
        index: routes.length - 1,
        path: window.location.href
      }
    } else if (routes.length === 0) {
      routes.push(path)

      window.router = {
        route: location,
        routes: routes,
        index: 0,
        path: window.location.href
      }
    }
  }

  const history: Navigator = {
    go,
    push
  }

  return history
}
