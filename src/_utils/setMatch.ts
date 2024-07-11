/// <reference types="../typing" />
import { deepCopy } from 'hsu-utils'

interface MatchData {
  match: Match
  path: string
  basicName: string
  paramKeys: string[]
}

export default function setMatch({ match, path, basicName, paramKeys }: MatchData) {
  const _match = deepCopy(match ?? [])

  if (paramKeys.length > 0) {
    path = path + '/:' + paramKeys.join('/:')
  }

  const __match = _match.find((item) => item.path === path)
  if (__match) {
    return _match
  }

  if (!basicName) {
    const __match: MatchItem = {
      basicName: ['/'],
      path
    }
    _match.push(__match)
  } else {
    const _basicName = match.filter((item) => basicName.includes(item.path)).map((item) => item.path)
    const __match: MatchItem = {
      basicName: _basicName,
      path
    }
    _match.push(__match)
  }

  window.match = _match
}
