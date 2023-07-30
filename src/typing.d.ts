declare type Match = string[] | null

declare type Params = Record<string, string | undefined>

declare interface IRouter {
  route: string
  routes: string[]
  index: number
}

declare interface Window {
  router: IRouter
}
