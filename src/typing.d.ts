declare interface Router {
  route: string
  routes: string[]
  index: number
  path: string
}

declare interface Window {
  router: Router
}
