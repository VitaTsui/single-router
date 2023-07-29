import { useCallback, useContext } from 'react'
import { NavigationContext } from '../contexts'
import { NavigateOptions } from '../history/_push'

interface NavigateFunction {
  (to: string | number, options?: NavigateOptions): void
}

export default function useNavigate(): NavigateFunction {
  const navigator = useContext(NavigationContext)?.navigator

  const navigate: NavigateFunction = useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === 'number') {
        navigator.go(to)
        return
      }
      navigator.push(to, options)
    },
    [navigator]
  )

  return navigate
}
