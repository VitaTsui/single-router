/// <reference types="../typing" />

import { describe, expect, test } from '@jest/globals'
import { createHistory } from '../history'

describe('createHistory', () => {
  const history = createHistory()

  test(`history.push`, () => {
    history.push('/push')
    const router = window.router
    expect(router).toEqual({ pathname: '/push', history: ['/push'], index: 0 })
  })
  test(`history.push`, () => {
    history.push('/push')
    history.push('/push2')
    const router = window.router
    expect(router).toEqual({ pathname: '/push2', history: ['/push', '/push2'], index: 1 })
  })
  test(`history.push`, () => {
    history.push('/push')
    history.push('/push2')
    history.push('/push')
    const router = window.router
    expect(router).toEqual({ pathname: '/push', history: ['/push'], index: 0 })
  })

  test(`history setRoute`, () => {
    let set = false

    try {
      window.router.pathname = '/push2'
      set = true
    } catch {
      set = false
    }
    expect(set).toBe(false)
  })

  test(`history.push replace`, () => {
    history.push('/go', { replace: true })
    const router = window.router
    expect(router).toEqual({ pathname: '/go', history: ['/go'], index: 0 })
  })

  test(`history.go`, () => {
    history.push('/go')
    history.push('/go1')
    history.go(-1)
    const router = window.router
    expect(router).toEqual({ pathname: '/go', history: ['/go', '/go1'], index: 0 })
  })
  test(`history.go`, () => {
    history.push('/go')
    history.go(-1)
    const router = window.router
    expect(router).toEqual({ pathname: '/go', history: ['/go'], index: 0 })
  })
  test(`history.go`, () => {
    history.push('/go')
    history.push('/go1')
    history.push('/go2')
    history.go(-1)
    history.go(1)
    const router = window.router
    expect(router).toEqual({ pathname: '/go2', history: ['/go', '/go1', '/go2'], index: 2 })
  })
  test(`history.go`, () => {
    history.push('/go')
    history.push('/go1')
    history.push('/go2')
    history.go(-1)
    history.go(-1)
    const router = window.router
    expect(router).toEqual({ pathname: '/go', history: ['/go', '/go1', '/go2'], index: 0 })
  })
})
