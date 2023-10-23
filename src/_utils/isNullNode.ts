/// <reference types="../typing" />

interface NodeInfo {
  location: string
  path: string
  paramKeys: string[]
  match: Match
  params: Params
}

export default function isNullNode({ location, path, paramKeys, match, params }: NodeInfo): boolean {
  if (Object.keys(params ?? {})?.length > 0) {
    throw new Error('Nesting in dynamic routes is not allowed.')
  }

  let isNull = false

  isNull = !location.includes(path)

  if (!isNull) {
    const _locationPart = location.split('/')
    const _pathPart = path.split('/')
    const isLengthEqual = _locationPart.length === _pathPart.length + paramKeys.length

    if (!isLengthEqual) {
      isNull = true
    }
  }

  if (isNull && match.length > 0) {
    const _match = match.find((item) => {
      const path = item.path

      const _locationPart = location.split('/')
      const _pathPart = path.split('/')
      const isLengthEqual = _locationPart.length === _pathPart.length

      return location.includes(path.replace(/(\/):(\w+)/gi, '')) && isLengthEqual
    })?.basicName

    if (_match && _match.includes(path)) {
      isNull = false
    }
  }

  return isNull
}
