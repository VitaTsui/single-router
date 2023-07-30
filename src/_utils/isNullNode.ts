interface NodeInfo {
  location: string
  path: string
  paramKeys: string[]
  match: Match
  params: Params
}

export default function isNullNode({ location, path, paramKeys, match, params }: NodeInfo): boolean {
  let isNull = false

  if (params) {
    isNull = true
    console.error('不允许在动态路由中嵌套路由')

    return isNull
  }

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
