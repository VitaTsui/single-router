import { useCallback, useContext } from 'react'
import { RouterContext } from '../contexts'
import { PushOptions } from '../history/_push'
import { GoOptions } from '../history/_go'

interface NavigateFunction {
  (to: string | number, options?: PushOptions | GoOptions): void
}

/**
 * Returns the navigate function.
 * - `navigate('/path')` navigates and records the entry in history; `{ replace: true }` resets history before navigating
 * - `navigate(1)` / `navigate(-1)` moves forward / backward (no-op when out of history bounds);
 *   with `{ replace: true }`, the routes after the target are removed from history
 */
export default function useNavigate(): NavigateFunction {
  const { navigator } = useContext(RouterContext)

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
