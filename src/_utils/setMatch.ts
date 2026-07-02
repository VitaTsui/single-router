/// <reference types="../typing" />
import { deepCopy } from 'hsu-utils'

interface MatchData {
  match: Match
  path: string
  basicName: string
  paramKeys: string[]
}

/** 纯函数：返回追加当前路由后的 match 快照（已存在则原样返回副本） */
export default function setMatch({ match, path, basicName, paramKeys }: MatchData): Match {
  const _match = deepCopy(match ?? [])

  if (paramKeys.length > 0) {
    path = path.replace(/\/$/, '') + '/:' + paramKeys.join('/:')
  }

  const existed = _match.find((item) => item.path === path)
  if (existed) {
    return _match
  }

  if (!basicName) {
    _match.push({
      basicName: ['/'],
      path
    })
  } else {
    const _basicName = _match.filter((item) => basicName.includes(item.path)).map((item) => item.path)
    _match.push({
      basicName: _basicName,
      path
    })
  }

  return _match
}
