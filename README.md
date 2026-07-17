# @hsu-react/single-router

[![npm version](https://img.shields.io/npm/v/@hsu-react/single-router.svg)](https://www.npmjs.com/package/@hsu-react/single-router)
[![license](https://img.shields.io/npm/l/@hsu-react/single-router.svg)](./LICENSE)

不改变浏览器 URL 的 React 单页内路由：以类似路由跳转的方式切换页面，API 参考 [React Router](https://github.com/remix-run/react-router) 设计，支持嵌套路由、动态参数、查询参数与路由隔离。

## 安装

```bash
npm install @hsu-react/single-router
# 或
yarn add @hsu-react/single-router
```

## 快速上手

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { SingleRouter } from "@hsu-react/single-router";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    {/* showPath 控制开发环境的路径栏是否展示，默认为 true */}
    <SingleRouter showPath>
      <App />
    </SingleRouter>
  </React.StrictMode>
);
```

## 组件

### `SingleRouter`

路由容器。默认情况下所有 `SingleRouter` 共享同一份全局路由状态（并持久化到 localStorage）。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| isolate | 创建独立路由状态（路由隔离） | `boolean` | `false` |
| persistKey | isolate 下持久化到 localStorage `single-router:state:<persistKey>`；不传则状态只存在内存，卸载即消失 | `string` | - |
| initialPath | isolate 下的初始路径 | `string` | `'/'` |
| showPath | 开发环境路径栏；isolate 实例默认关闭（多实例会互相遮挡） | `boolean` | `!isolate` |

#### 路由隔离（isolate）

传入 `isolate` 后，该路由树持有**独立的路由状态**，与其他 `SingleRouter`（含全局实例）互不影响——适合在不同页面 / 弹窗内各自嵌一套局部路由：

```tsx
{/* 页面 A 与页面 B 的局部路由互不干扰 */}
<SingleRouter isolate>
  <PageARoutes />
</SingleRouter>

<SingleRouter isolate>
  <PageBRoutes />
</SingleRouter>
```

> 注意：`routerHistory`（组件树外导航）只作用于**默认全局实例**，isolate 实例请在组件内用 `useNavigate`。

### `Route`

声明一条路由。`path` 需要写**完整路径**；也可以不手写 `Route`，用 [`useRoutes`](#useroutes) 由配置生成。

```tsx
import React from "react";
import { Route } from "@hsu-react/single-router";

const App: React.FC = () => {
  return (
    <div className="App">
      <Route path="/path1" element={<AppOne />} />
      <Route path="/path2" element={<AppTwo />} />
    </div>
  );
};

export default App;
```

嵌套路由：子路由写在子组件内部、原地加载（想到达 `/path1/path1-1` 需先进入 `<AppOne />`）：

```tsx
import React from "react";
import { Route } from "@hsu-react/single-router";

const AppOne: React.FC = () => {
  return (
    <div className="AppOne">
      {/* path 需为完整路径 */}
      <Route path="/path1/path1-1" element={<AppOneOne />} />
    </div>
  );
};

export default AppOne;
```

### `Outlet`

带 `children` 的路由配置中，父级 `element` 通过 `<Outlet />` 渲染当前匹配的子路由（嵌套布局），可用 `context` 向子路由透传值：

```tsx
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

## Hooks

### `useRoutes`

根据路由配置树生成路由元素：

```tsx
import { useRoutes, Routes } from "@hsu-react/single-router";

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
        index: true, // 相当于 path: "/path3"
        element: <AppThree />,
      },
      {
        path: "/:id", // 自动拼接父路径，相当于 "/path3/:id"（也可写完整的 "/path3/:id"）
        element: <AppThreeOne />,
      },
    ],
  },
];

const App: React.FC = () => {
  const routes = useRoutes(ROUTERS);

  return <div className="App">{routes}</div>;
};
```

### `useNavigate`

路由跳转：

```tsx
import { useNavigate } from "@hsu-react/single-router";

const navigate = useNavigate();

// 跳转，并记录进 history
navigate("/path1");
// 重置 history 后跳转
navigate("/path1", { replace: true });

// 前进 / 后退（超出 history 范围时不执行）
navigate(1);
navigate(-1);
// 前进 / 后退，并把其后的路由从 history 中删除
navigate(1, { replace: true });
navigate(-1, { replace: true });
```

### `useLocation`

获取当前路由状态：

```tsx
import { useLocation } from "@hsu-react/single-router";

// { pathname: string, history: string[], index: number }
// 初始状态为 { pathname: '', history: [], index: -1 }
const location = useLocation();
```

### `useParams`

获取动态路由参数（如 `/path3/:id` 中的 `id`）：

```tsx
import { useParams } from "@hsu-react/single-router";

// { id: string | undefined }
const { id } = useParams<{ id: string }>();
```

### `useSearch`

读取与修改查询参数：

```tsx
import { useSearch } from "@hsu-react/single-router";

const [{ id }, setSearch] = useSearch<{ id: string }>();

// 修改当前路由 search，历史记录不变（replace 默认为 true）
setSearch({ id: [1] });
// 修改当前路由 search，并在历史中新增一条记录
setSearch({ id: [1] }, { replace: false });
```

## 开发

```bash
yarn          # 安装依赖
yarn build    # 构建 es/ + lib/ + dist/
yarn test     # 运行单元测试
```

## 贡献

日常开发在 `develop` 分支进行（feature 分支合入 `develop`），`main` 只接受来自 `develop` 的 PR；合入 `main` 后按 `package.json` 版本自动打 tag 并发布 npm。PR 标题遵循 [Conventional Commits](https://www.conventionalcommits.org/)。

## License

[MIT](./LICENSE) © VitaHsu
