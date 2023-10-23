import { useCallback, useContext } from 'react'
import { NavigationContext } from '../contexts'
import { PushOptions } from '../history/_push'
import { GoOptions } from '../history/_go'

interface NavigateFunction {
  (to: string | number, options?: PushOptions | GoOptions): void
}

export default function useNavigate(): NavigateFunction {
  const navigator = useContext(NavigationContext).navigator

  const navigate: NavigateFunction = useCallback(
    (to: string | number, options?: PushOptions | GoOptions) => {
      if (typeof to === 'number') {
        navigator.go(to, options as GoOptions)
        return
      }

      if (!to.startsWith('/')) to = `/${to}`
      navigator.push(to, options as PushOptions)
    },
    [navigator]
  )

  return navigate
}
