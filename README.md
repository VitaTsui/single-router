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
    // children 中的路由平级, 且与 "/path1"、"/path2" 平级
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
