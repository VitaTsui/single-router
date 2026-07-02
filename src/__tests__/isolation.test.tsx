import React from 'react'
import { describe, expect, test, beforeEach } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import { SingleRouter, Route, useNavigate, routerHistory, defaultRouterStore } from '../index'

/** 点击后跳转到指定路径的按钮 */
const NavButton: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const navigate = useNavigate()
  return <button onClick={() => navigate(to)}>{label}</button>
}

describe('路由隔离（isolate）', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('两个 isolate 实例互不影响', () => {
    render(
      <>
        <SingleRouter isolate>
          <NavButton to='/detail' label='goA' />
          <Route path='/detail' element={<div>A-detail</div>} />
        </SingleRouter>
        <SingleRouter isolate>
          <NavButton to='/detail' label='goB' />
          <Route path='/detail' element={<div>B-detail</div>} />
        </SingleRouter>
      </>
    )

    // 初始都未匹配
    expect(screen.queryByText('A-detail')).toBeNull()
    expect(screen.queryByText('B-detail')).toBeNull()

    // A 导航后只有 A 渲染，B 不受影响
    act(() => {
      screen.getByText('goA').click()
    })
    expect(screen.queryByText('A-detail')).not.toBeNull()
    expect(screen.queryByText('B-detail')).toBeNull()
  })

  test('isolate 实例不受默认全局 store（routerHistory）影响', () => {
    render(
      <SingleRouter isolate>
        <Route path='/global' element={<div>isolated-view</div>} />
      </SingleRouter>
    )

    act(() => {
      routerHistory.push('/global')
    })
    // 全局导航不影响隔离实例
    expect(screen.queryByText('isolated-view')).toBeNull()
  })

  test('非 isolate 实例共享默认全局 store（向后兼容）', () => {
    render(
      <SingleRouter showPath={false}>
        <Route path='/shared' element={<div>shared-view</div>} />
      </SingleRouter>
    )

    act(() => {
      routerHistory.push('/shared')
    })
    expect(screen.queryByText('shared-view')).not.toBeNull()
    expect(defaultRouterStore.getState().pathname).toBe('/shared')
  })

  test('isolate + initialPath：独立初始路径', () => {
    render(
      <SingleRouter isolate initialPath='/home'>
        <Route path='/home' element={<div>home-view</div>} />
      </SingleRouter>
    )
    expect(screen.queryByText('home-view')).not.toBeNull()
  })

  test('isolate + persistKey：持久化到独立 key', () => {
    const { unmount } = render(
      <SingleRouter isolate persistKey='page-a'>
        <NavButton to='/saved' label='go' />
        <Route path='/saved' element={<div>saved-view</div>} />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('go').click()
    })
    expect(screen.queryByText('saved-view')).not.toBeNull()
    unmount()

    // 重新挂载同 persistKey 的实例，状态恢复
    render(
      <SingleRouter isolate persistKey='page-a'>
        <Route path='/saved' element={<div>saved-view-2</div>} />
      </SingleRouter>
    )
    expect(screen.queryByText('saved-view-2')).not.toBeNull()
    // 且默认全局 key 未被污染
    expect(localStorage.getItem('single-router:state:page-a')).not.toBeNull()
  })
})
