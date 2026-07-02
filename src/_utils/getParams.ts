/// <reference types="../typing" />

/** 从 pathname 末尾按 paramKeys 数量提取参数（适用于参数在末尾的扁平路由） */
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
 * 按 pattern 的段位置提取参数，支持参数在路径中间的场景。
 * 例：pattern /users/:id/posts + pathname /users/5/posts → { id: '5' }
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
