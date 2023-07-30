/// <reference types="../typing" />

export interface NavigateOptions {
  replace?: boolean
}

export default function push(path: string, options?: NavigateOptions) {
  if (options?.replace) {
    window.router = {
      pathname: path,
      history: [path],
      index: 0
    }

    return
  }

  const location = path
  const history = window.router.history
  const locationIndex = history.indexOf(location)

  if (history.length > 0 && locationIndex !== -1 && locationIndex !== history.length - 1) {
    window.router = {
      pathname: location,
      history: history.slice(0, locationIndex + 1),
      index: locationIndex
    }
  } else if (history.length > 0) {
    if (path !== history[history.length - 1]) {
      history.push(path)
    }

    window.router = {
      pathname: location,
      history: history,
      index: history.length - 1
    }
  } else if (history.length === 0) {
    history.push(path)

    window.router = {
      pathname: location,
      history: history,
      index: 0
    }
  }
}
