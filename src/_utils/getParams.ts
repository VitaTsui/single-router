/// <reference types="../typing" />

export default function getParams(location: string, paramKeys: string[]): Params {
  if (paramKeys.length === 0) return {}

  let _locationPart = location.split('/').filter(Boolean)
  _locationPart = _locationPart.slice(_locationPart.length - paramKeys.length, _locationPart.length)
  const _params = paramKeys.reduce((acc: Params, cur, idx) => {
    acc[cur] = _locationPart[idx]
    return acc
  }, {})
  return _params
}
