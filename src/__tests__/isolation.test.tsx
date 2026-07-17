import React from 'react'
import { describe, expect, test, beforeEach } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import { SingleRouter, Route, useNavigate, routerHistory, defaultRouterStore } from '../index'

/** Button that navigates to the given path on click */
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

    // Neither matches initially
    expect(screen.queryByText('A-detail')).toBeNull()
    expect(screen.queryByText('B-detail')).toBeNull()

    // After A navigates, only A renders; B is unaffected
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
    // Global navigation does not affect the isolated instance
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

    // Remounting an instance with the same persistKey restores the state
    render(
      <SingleRouter isolate persistKey='page-a'>
        <Route path='/saved' element={<div>saved-view-2</div>} />
      </SingleRouter>
    )
    expect(screen.queryByText('saved-view-2')).not.toBeNull()
    // And the default global key is not polluted
    expect(localStorage.getItem('single-router:state:page-a')).not.toBeNull()
  })
})
