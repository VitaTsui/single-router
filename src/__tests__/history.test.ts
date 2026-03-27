/// <reference types="../typing" />

import { describe, expect, test, beforeEach } from '@jest/globals'
import { createHistory } from '../history'

describe('createHistory', () => {
  const history = createHistory()

  beforeEach(() => {
    localStorage.clear()
  })

  // ─── push ────────────────────────────────────────────────────────────────

  test('push：首次导航', () => {
    history.push('/push')
    expect(window.router).toMatchObject({ pathname: '/push', history: ['/push'], index: 0 })
  })

  test('push：连续两次导航', () => {
    history.push('/push')
    history.push('/push2')
    expect(window.router).toMatchObject({ pathname: '/push2', history: ['/push', '/push2'], index: 1 })
  })

  test('push：重复导航到已有路径时回退并截断', () => {
    history.push('/push')
    history.push('/push2')
    history.push('/push')
    expect(window.router).toMatchObject({ pathname: '/push', history: ['/push'], index: 0 })
  })

  test('push replace：替换当前条目', () => {
    history.push('/go', { replace: true })
    expect(window.router).toMatchObject({ pathname: '/go', history: ['/go'], index: 0 })
  })

  test('push replace：有历史时替换当前条目', () => {
    history.push('/go')
    history.push('/go1')
    history.push('/go2', { replace: true })
    expect(window.router).toMatchObject({ pathname: '/go2', history: ['/go', '/go2'], index: 1 })
  })

  test('push：在历史中间位置 push 时截断后续历史', () => {
    history.push('/a')
    history.push('/b')
    history.push('/c')
    history.go(-1) // 退到 /b，index=1，/c 仍在 history 里
    history.push('/d') // 此时 index(1) !== length-1(2)，应截断 /c 并追加 /d
    expect(window.router).toMatchObject({ pathname: '/d', history: ['/a', '/b', '/d'], index: 2 })
  })

  // ─── push 查询参数解析（getSearch）────────────────────────────────────────

  test('push：解析 JSON 类型的查询参数（数字、布尔值）', () => {
    history.push('/page?count=5&flag=true')
    const { index, search } = window.router
    expect(search[index]).toEqual({ count: 5, flag: true })
  })

  test('push：解析字符串查询参数（JSON.parse 失败时回退为字符串）', () => {
    history.push('/page?name=John&redirect=/other/path')
    const { index, search } = window.router
    expect(search[index]).toEqual({ name: 'John', redirect: '/other/path' })
  })

  test('push：忽略畸形查询参数（缺少 key 或 value）', () => {
    // ?=value 缺 key、?key= 缺 value、?valid=1 正常
    history.push('/page?=nokey&empty=&valid=1')
    const { index, search } = window.router
    expect(search[index]).toEqual({ valid: 1 })
  })

  // ─── 不可变性 ─────────────────────────────────────────────────────────────

  test('router 对象不可直接赋值', () => {
    let set = false
    try {
      window.router.pathname = '/push2'
      set = true
    } catch {
      set = false
    }
    expect(set).toBe(false)
  })

  // ─── go ──────────────────────────────────────────────────────────────────

  test('go(-1)：在历史中后退', () => {
    history.push('/go')
    history.push('/go1')
    history.go(-1)
    expect(window.router).toMatchObject({ pathname: '/go', history: ['/go', '/go1'], index: 0 })
  })

  test('go(-1)：已在第一条时不变', () => {
    history.push('/go')
    history.go(-1)
    expect(window.router).toMatchObject({ pathname: '/go', history: ['/go'], index: 0 })
  })

  test('go(-1) 后 go(1)：前进回来', () => {
    history.push('/go')
    history.push('/go1')
    history.push('/go2')
    history.go(-1)
    history.go(1)
    expect(window.router).toMatchObject({ pathname: '/go2', history: ['/go', '/go1', '/go2'], index: 2 })
  })

  test('go(-2)：连续后退两步', () => {
    history.push('/go')
    history.push('/go1')
    history.push('/go2')
    history.go(-1)
    history.go(-1)
    expect(window.router).toMatchObject({ pathname: '/go', history: ['/go', '/go1', '/go2'], index: 0 })
  })

  test('go(1)：已在最后时不变', () => {
    history.push('/go')
    history.push('/go1')
    history.go(1)
    expect(window.router).toMatchObject({ pathname: '/go1', history: ['/go', '/go1'], index: 1 })
  })

  test('go replace：后退并截断后续历史', () => {
    history.push('/a')
    history.push('/b')
    history.push('/c')
    history.go(-1, { replace: true }) // 退到 /b，同时截断 /c
    expect(window.router).toMatchObject({ pathname: '/b', history: ['/a', '/b'], index: 1 })
  })
})
