import React from 'react'
import { describe, expect, test } from '@jest/globals'
import { render, screen, act } from '@testing-library/react'
import { SingleRouter, Outlet, useRoutes, useNavigate, useOutletContext, useParams, Routes } from '../index'

const Layout: React.FC<{ title: string; context?: unknown }> = ({ title, context }) => {
  return (
    <div>
      <h1>{title}</h1>
      <Outlet context={context} />
    </div>
  )
}

const ContextReader: React.FC = () => {
  const value = useOutletContext<{ msg: string }>()
  return <div>ctx:{value?.msg}</div>
}

const ParamReader: React.FC<{ prefix: string }> = ({ prefix }) => {
  const { id } = useParams<{ id: string }>()
  return (
    <div>
      {prefix}:{id}
    </div>
  )
}

const NavButton: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const navigate = useNavigate()
  return <button onClick={() => navigate(to)}>{label}</button>
}

const App: React.FC<{ routes: Routes; nav: Array<{ to: string; label: string }> }> = ({ routes, nav }) => {
  const Views = useRoutes(routes)
  return (
    <>
      {nav.map((n) => (
        <NavButton key={n.label} {...n} />
      ))}
      {Views}
    </>
  )
}

describe('Outlet 嵌套路由', () => {
  test('index 子路由与叶子子路由随导航切换', () => {
    const routes: Routes = [
      {
        path: '/users',
        element: <Layout title='users-layout' />,
        children: [
          { index: true, element: <div>users-index</div> },
          { path: 'list', element: <div>users-list</div> }
        ]
      }
    ]

    render(
      <SingleRouter isolate>
        <App
          routes={routes}
          nav={[
            { to: '/users', label: 'goUsers' },
            { to: '/users/list', label: 'goList' }
          ]}
        />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('goUsers').click()
    })
    expect(screen.queryByText('users-layout')).not.toBeNull()
    expect(screen.queryByText('users-index')).not.toBeNull()
    expect(screen.queryByText('users-list')).toBeNull()

    act(() => {
      screen.getByText('goList').click()
    })
    expect(screen.queryByText('users-layout')).not.toBeNull()
    expect(screen.queryByText('users-index')).toBeNull()
    expect(screen.queryByText('users-list')).not.toBeNull()
  })

  test('useOutletContext：子路由读取 Outlet 透传值', () => {
    const routes: Routes = [
      {
        path: '/ctx',
        element: <Layout title='ctx-layout' context={{ msg: 'hello' }} />,
        children: [{ index: true, element: <ContextReader /> }]
      }
    ]

    render(
      <SingleRouter isolate>
        <App routes={routes} nav={[{ to: '/ctx', label: 'goCtx' }]} />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('goCtx').click()
    })
    expect(screen.queryByText('ctx:hello')).not.toBeNull()
  })

  test('父路径动态参数：父 element 与叶子子路由都能读取', () => {
    const routes: Routes = [
      {
        path: '/users/:id',
        element: (
          <div>
            <ParamReader prefix='parent' />
            <Outlet />
          </div>
        ),
        children: [
          { index: true, element: <div>profile-index</div> },
          { path: 'posts', element: <ParamReader prefix='child' /> }
        ]
      }
    ]

    render(
      <SingleRouter isolate>
        <App
          routes={routes}
          nav={[
            { to: '/users/42', label: 'goUser' },
            { to: '/users/42/posts', label: 'goPosts' }
          ]}
        />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('goUser').click()
    })
    expect(screen.queryByText('parent:42')).not.toBeNull()
    expect(screen.queryByText('profile-index')).not.toBeNull()

    act(() => {
      screen.getByText('goPosts').click()
    })
    expect(screen.queryByText('parent:42')).not.toBeNull()
    expect(screen.queryByText('child:42')).not.toBeNull()
  })

  test('多级嵌套：中间层递归渲染', () => {
    const routes: Routes = [
      {
        path: '/a',
        element: <Layout title='layout-a' />,
        children: [
          {
            path: 'b',
            element: <Layout title='layout-b' />,
            children: [{ path: 'c', element: <div>leaf-c</div> }]
          }
        ]
      }
    ]

    render(
      <SingleRouter isolate>
        <App routes={routes} nav={[{ to: '/a/b/c', label: 'goDeep' }]} />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('goDeep').click()
    })
    expect(screen.queryByText('layout-a')).not.toBeNull()
    expect(screen.queryByText('layout-b')).not.toBeNull()
    expect(screen.queryByText('leaf-c')).not.toBeNull()
  })

  test('未匹配子路由时 Outlet 渲染为空', () => {
    const routes: Routes = [
      {
        path: '/empty',
        element: <Layout title='empty-layout' />,
        children: [{ path: 'sub', element: <div>sub-view</div> }]
      }
    ]

    render(
      <SingleRouter isolate>
        <App routes={routes} nav={[{ to: '/empty', label: 'goEmpty' }]} />
      </SingleRouter>
    )

    act(() => {
      screen.getByText('goEmpty').click()
    })
    expect(screen.queryByText('empty-layout')).not.toBeNull()
    expect(screen.queryByText('sub-view')).toBeNull()
  })
})
