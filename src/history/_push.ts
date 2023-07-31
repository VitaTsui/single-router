/// <reference types="../typing" />

export interface NavigateOptions {
  replace?: boolean
}

export default function push(pathname: string, options?: NavigateOptions) {
  if (options?.replace) {
    window.router = {
      pathname,
      history: [pathname],
      index: 0
    }

    return
  }

  const { history, index } = window.router

  const lastHistory = history[index]

  if (lastHistory !== pathname) {
    history.push(pathname)

    window.router = {
      pathname,
      history: history,
      index: history.length - 1
    }
  }
}
