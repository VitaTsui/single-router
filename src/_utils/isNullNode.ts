import { useContext } from 'react'
import { ParamsContext } from '../contexts'

interface NodeInfo {
  location: string
  path: string
  paramKeys: string[]
  match: Match
}

export default function isNullNode({ location, path, paramKeys, match }: NodeInfo): boolean {
  const params = useContext(ParamsContext)?.params
  if (params) {
    throw new Error('Nesting in dynamic routes is not allowed.')
  }

  let isNull = false

  isNull = !location.includes(path)

  if (!isNull) {
    const _locationPart = location.split('/')
    const _pathPart = path.split('/')
    if (_locationPart.length !== _pathPart.length + paramKeys.length) {
      isNull = true
    }
  }

  if (isNull && !paramKeys.length && match) {
    if (match.includes(path)) {
      isNull = false
    }
  }

  return isNull
}
