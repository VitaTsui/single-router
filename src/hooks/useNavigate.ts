import { useCallback, useContext } from 'react'
import { NavigationContext } from '../contexts'

interface NavigateFunction {
  (to: string | number): void
}

export default function useNavigate(): NavigateFunction {
  const { navigator } = useContext(NavigationContext)

  const navigate: NavigateFunction = useCallback(
    (to: string | number) => {
      if (typeof to === 'number') {
        navigator.go(to)
        return
      }
      navigator.push(to)
    },
    [navigator]
  )

  return navigate
}
