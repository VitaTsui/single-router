/// <reference types="../typing" />

export interface NavigateOptions {
  replace?: boolean
}

export default function push(path: string, options?: NavigateOptions) {
  const location = path

  if (options?.replace) {
    window.router = {
      route: location,
      routes: [location],
      index: 0
    }

    return
  }

  const routes = window.router.routes
  const locationIndex = routes.indexOf(location)

  if (routes.length > 0 && locationIndex !== -1 && locationIndex !== routes.length - 1) {
    window.router = {
      route: location,
      routes: routes.slice(0, locationIndex + 1),
      index: locationIndex
    }
  } else if (routes.length > 0) {
    if (path !== routes[routes.length - 1]) {
      routes.push(path)
    }

    window.router = {
      route: location,
      routes: routes,
      index: routes.length - 1
    }
  } else if (routes.length === 0) {
    routes.push(path)

    window.router = {
      route: location,
      routes: routes,
      index: 0
    }
  }
}
