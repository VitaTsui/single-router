/// <reference types="../typing" />

export default function go(delta: number) {
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
    index: locationIndex
  }
}
