declare interface IRouter {
  route: string
  routes: string[]
  index: number
}

declare interface Window {
  router: IRouter
}
