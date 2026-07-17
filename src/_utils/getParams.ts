/// <reference types="../typing" />

/** Extracts params from the end of pathname by the number of paramKeys (for flat routes whose params sit at the end) */
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

/**
 * Extracts params by segment position in the pattern, supporting params in the middle of the path.
 * e.g. pattern /users/:id/posts + pathname /users/5/posts → { id: '5' }
 */
export function getParamsByPattern(location: string, pattern: string): Params {
  const patternParts = pattern.split('/').filter(Boolean)
  const locationParts = location.split('/').filter(Boolean)

  const params: Params = {}
  patternParts.forEach((part, i) => {
    if (part.startsWith(':')) {
      params[part.slice(1)] = locationParts[i]
    }
  })
  return params
}
