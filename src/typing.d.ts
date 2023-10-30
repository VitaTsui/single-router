declare interface MatchItem {
  basicName: string[]
  path: string
}

declare type Match = Array<MatchItem>

declare type Params = Record<string, string | undefined>

declare type Search = Record<string, unknown>

declare interface IRouter {
  pathname: string
  history: Array<string>
  search: Array<Search>
  index: number
}

declare interface Window {
  router: IRouter
  match: Match
}
