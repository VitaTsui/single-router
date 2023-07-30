/// <reference types="../typing" />

export default function go(delta: number) {
  const history = window.router.history
  const lastLocationIndex = window.router.index
  let locationIndex = 0

  if (typeof lastLocationIndex === 'number') {
    if (lastLocationIndex === history.length - 1) {
      if (delta < 0 && lastLocationIndex + delta >= 0) {
        locationIndex = lastLocationIndex + delta
      } else {
        locationIndex = lastLocationIndex
      }
    } else {
      if (
        (delta < 0 && lastLocationIndex + delta >= 0) ||
        (delta > 0 && lastLocationIndex + delta <= history.length - 1)
      ) {
        locationIndex = lastLocationIndex + delta
      }
    }
  }

  const location = history[locationIndex]

  window.router = {
    pathname: location,
    history: history,
    index: locationIndex
  }
}
