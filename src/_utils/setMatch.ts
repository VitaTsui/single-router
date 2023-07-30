export default function setMatch(match: Match, paramKeys: string[], path: string): Match {
  if (!!paramKeys.length) {
    return match
  }

  if (!match) {
    match = [path]

    return match
  }

  for (const item of match) {
    if (path.includes(item)) {
      match.push(path)

      break
    }
  }

  if (match.includes(path)) {
    match = null
  }

  return match
}
