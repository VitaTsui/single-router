/// <reference types="../typing" />

interface NodeInfo {
  location: string
  path: string
  paramKeys: string[]
  match: Match
  params: Params
  refresh: boolean
}

/** Segment-level prefix match: avoids substring false positives (e.g. /path1 wrongly matching /path10) */
function isSegmentPrefix(location: string, path: string): boolean {
  const locationParts = location.split('/').filter(Boolean)
  const pathParts = path.split('/').filter(Boolean)
  if (pathParts.length > locationParts.length) return false
  return pathParts.every((part, i) => part === locationParts[i])
}

export default function isNullNode({ location, path, paramKeys, match, params, refresh }: NodeInfo): boolean {
  if (Object.keys(params ?? {})?.length > 0) {
    throw new Error('Nesting in dynamic routes is not allowed.')
  }

  let isNull = false

  isNull = !isSegmentPrefix(location, path)

  if (!isNull) {
    const _locationPart = location.split('/').filter(Boolean)
    const _pathPart = path.split('/').filter(Boolean)
    const isLengthEqual = _locationPart.length === _pathPart.length + paramKeys.length

    if (!isLengthEqual) {
      isNull = true
    }
  }

  if (isNull && match.length > 0) {
    const _match = match.find((item) => {
      const itemStatic = item.path.replace(/(\/):(\w+)/gi, '')

      const _locationPart = location.split('/')
      const _pathPart = item.path.split('/')
      const isLengthEqual = _locationPart.length === _pathPart.length

      return isSegmentPrefix(location, itemStatic) && isLengthEqual
    })?.basicName

    if (_match && _match.includes(path)) {
      isNull = false
    }
  }

  if (!isNull) {
    isNull = refresh
  }

  return isNull
}
