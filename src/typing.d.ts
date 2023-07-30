declare interface MatchItem {
  basicName: string[]
  path: string
}

declare type Match = Array<MatchItem>

declare type Params = Record<string, string | undefined>

declare interface IRouter {
  pathname: string
  history: string[]
  index: number
}

declare interface Window {
  router: IRouter
  match: Match
}
