import { useContext } from 'react'
import { ParamsContext } from '../contexts'

/**
 * Returns the current route's dynamic params (e.g. id in '/users/:id').
 * The generic T describes the expected param shape; unmatched fields are undefined.
 */
export default function useParams<T extends Partial<T>>(): Params | T {
  const params = useContext(ParamsContext).params

  return params
}
