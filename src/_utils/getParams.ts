/// <reference types="../typing" />

export default function getParams(location: string, paramKeys: string[]): Params {
  let _locationPart = location.split('/')
  _locationPart = _locationPart.slice(_locationPart.length - paramKeys.length, _locationPart.length)
  const _params = paramKeys.reduce((acc: Record<string, string | undefined>, cur, idx) => {
    acc[cur] = _locationPart[idx]
    return acc
  }, {} as Record<string, string | undefined>)
  return _params
}
