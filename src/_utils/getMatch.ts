/// <reference types="../typing" />

interface MatchData {
  match: Match
  path: string
  basicName: string
  paramKeys: string[]
}

export default function setMatch({ match, path, basicName, paramKeys }: MatchData): Match {
  if (!match) {
    match = []
  }

  if (paramKeys.length > 0) {
    path = path + '/:' + paramKeys.join('/:')
  }

  const _match = match.find((item) => item.path === path)
  if (_match) {
    return match
  }

  if (!basicName) {
    const __match: MatchItem = {
      basicName: ['/'],
      path
    }
    match.push(__match)
  } else {
    const _basicName = match.filter((item) => basicName.includes(item.path)).map((item) => item.path)
    const __match: MatchItem = {
      basicName: _basicName,
      path
    }
    match.push(__match)
  }

  return match
}
