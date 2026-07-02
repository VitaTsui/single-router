# [Single Router](https://github.com/VitaTsui/single-router#single-router)

## 前言

`single-router` 可以在不改变浏览器路由的情况下，以类似路由跳转的方式变更页面

## 参考

- [React Router](https://github.com/remix-run/react-router/tree/main/packages/react-router)

## 安装

```sh
npm install --save @hsu-react/single-router
# 或
yarn add @hsu-react/single-router
```

## 组件

### `SingleRouter`

```react
import React from "react";
import App from "./App";
import { SingleRouter } from "@hsu-react/single-router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    // showPath 默认为true 控制路由框是否展示 仅在开发环境作用
    <SingleRouter showPath={true}>
      <App />
    </SingleRouter>
  </React.StrictMode>
);
```

> #### 路由隔离（isolate）

默认情况下所有 `SingleRouter` 共享同一份全局路由状态（并持久化到 localStorage）。
传入 `isolate` 后，该路由树持有**独立的路由状态**，与其他 SingleRouter（含全局实例）互不影响——
适合在不同页面 / 弹窗内各自嵌一套局部路由：

```react
// 页面 A 与页面 B 的局部路由互不干扰
<SingleRouter isolate>
  <PageARoutes />
</SingleRouter>

<SingleRouter isolate>
  <PageBRoutes />
</SingleRouter>
```

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isolate | 创建独立路由状态（路由隔离） | `boolean` | `false` |
| persistKey | isolate 下持久化到 localStorage `single-router:state:<persistKey>`；不传则状态只存在内存，卸载即消失 | `string` | - |
| initialPath | isolate 下的初始路径 | `string` | `'/'` |
| showPath | 开发环境路径栏；isolate 实例默认关闭（多实例会互相遮挡） | `boolean` | `!isolate` |

> 注意：`routerHistory`（组件树外导航）只作用于**默认全局实例**，isolate 实例请在组件内用 `useNavigate`。

### `Route`

> #### 基本使用

```react
import React from "react";
import { Route } from "@hsu-react/single-router";

const App: React.FC = () => {
  return (
    <div className="App">
      // 可通过 useRoutes 生成
      <Route path="/path1" element={<AppOne />} />
      <Route path="/path2" element={<AppTwo />} />
      ...
    </div>
  );
};

export default App;
```

> #### 嵌套路由

```react
import React from "react";
import { Route } from "@hsu-react/single-router";

const AppOne: React.FC = () => {
  return (
    <div className="AppOne">
      // 1. 需要完整路由
      // 2. 若想跳转 "/path1/path1-1" 需要先进入 <AppOne />
      // 3. 原地加载 <AppOneOne />
      // 4. 可通过 useRoutes 生成
      <Route path="/path1/path1-1" element={<AppOneOne />} />
      ...
    </div>
  );
};

export default AppOne;
```

## HOOKS

### `useRoutes`

`useRoutes` 可以根据路由树，生成路由

```react
import { Routes } from "@hsu-react/single-router";

const ROUTERS: Routes = [
  {
    path: "/path1",
    element: <AppOne />,
  },
  {
    path: "/path2",
    element: <AppTwo />,
  },
  {
    path: "/path3",
    element: <AppThreeLayout />, // 父级布局，内部用 <Outlet /> 渲染匹配的子路由
    children: [
      {
        index: true, // 相当于 'path: "/path3"'
        element: <AppThree />,
      },
      {
        // path: "/path3/:id",
        // 或
        path: "/:id", // 会自动添加 "/path3"，相当于 "/path3/:id"
        element: <AppThreeOne />,
      },
    ]
  },
  ...
];

export default ROUTERS;
```

### `Outlet`

带 `children` 的路由中，父级 `element` 通过 `<Outlet />` 渲染当前匹配的子路由（嵌套布局）：

```react
import { Outlet, useOutletContext } from "@hsu-react/single-router";

const AppThreeLayout: React.FC = () => {
  return (
    <div>
      <header>公共头部</header>
      {/* 透传给子路由的值（可选） */}
      <Outlet context={{ msg: "from-layout" }} />
    </div>
  );
};

// 子路由内读取 Outlet 透传的值
const AppThree: React.FC = () => {
  const { msg } = useOutletContext<{ msg: string }>();
  return <div>{msg}</div>;
};
```

- 支持多级嵌套（children 里再有 children，逐层 `<Outlet />`）
- 父路径含动态段（如 `/users/:id`）时，父 `element` 与子路由内都可用 `useParams` 取到参数

```react
import { useRoutes } from "@hsu-react/single-router";
import ROUTERS from "./Routers";
...

const App: React.FC = () => {
  const Routes = useRoutes(ROUTERS);

  return (
    <div className="App">
      {Routes}
    </div>
  );
};
```

### `useNavigate`

通过 `useNavigate` 进行路由跳转

```react
import React, { useEffect } from "react";
import { useNavigate } from "@hsu-react/single-router";
...

const App: React.FC = () => {
  ...

  const navigate = useNavigate();

  useEffect(() => {
    // 跳转
    // 跳转的路由会被记录在 history 中
    navigate("/path1");
    // 将history重置并跳转
    navigate("/path1", { replace: true });

    // 前进 | 后退
    // 若超出history的范围，则不会被执行
    // navigate(1)
    // navigate(-1)
    // 会将其后的路由都将从 history 中删除
    // navigate(1, { replace: true })
    // navigate(-1 , { replace: true })
  }, [navigate]);

  ...
};

```

### `useLocation`

使用 `useLocation` 获取当前路由

```react
import React, { useEffect } from "react";
import { useLocation } from "@hsu-react/single-router";
...

const App: React.FC = () => {
  ...

  const location = useLocation();

  useEffect(() => {
    // {pathname: string, history: string[], index: number}
    // 初始状态
    // {pathname: '', history: [], index: -1}
    console.log(location)
  }, [location]);

  ...
};

```

### `useParams`

使用 `useParams` 获取动态路由参数

```react
import React, { useEffect } from "react";
import { useParams } from "@hsu-react/single-router";
...

const App: React.FC = () => {
  ...

  // return {id: string | undefined}
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    console.log(id);
  }, [id]);

  ...
};

```

### `useSearch`

使用 `useSearch` 获取查询参数参数

```react
import React, { useEffect } from "react";
import { useSearch } from "@hsu-react/single-router";
...

const App: React.FC = () => {
  ...

  // return {id: string | undefined}
  const [{ id }, setSearch] = useSearch<{ id: string }>();

  useEffect(() => {
    console.log(id);

    // 修改当前路由search, 并新增一条记录
    setSearch({id: [1]})
    // 修改当前路由search, 历史路由记录不变
    setSearch({id: [1]}, { replace: true })
  }, [id]);

  ...
};

```

## License

MIT
