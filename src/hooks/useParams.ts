import { useContext } from 'react'
import { ParamsContext } from '../contexts'

export default function useParams<T extends Partial<T>>(): Record<string, string | undefined> | T {
  const params = useContext(ParamsContext)?.params

  return params
}
