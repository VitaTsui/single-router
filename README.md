# Single Router

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

## 使用

### `<Router>`

```react
import React from "react";
import App from "./App";
import { Router } from "@hsu-react/single-router";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
```

### `<Route>`

#### 基本使用

```react
import React from "react";
import { Route } from "@hsu-react/single-router";

const App: React.FC = () => {
  return (
    <div className="App">
      <Route path="/path1" component={<AppOne />} />
      <Route path="/path2" component={<AppTwo />} />
      ...
    </div>
  );
};

export default App;
```

#### 嵌套路由

```react
import React from "react";
import { Route } from "@hsu-react/single-router";

const AppOne: React.FC = () => {
  return (
    <div className="App">
      // 1. 需要完整路由
      // 2. 若想跳转 "/path1/path1-1" 需要先跳转 <AppOne />
      // 3. <AppOneOne /> 加载至当前位置
      // 4. 可通过 useRoutes 生成，同样需要保证路由完整
      <Route path="/path1/path1-1" component={<AppOneOne />} />
      ...
    </div>
  );
};

export default AppOne;
```

### `useRoutes`

根据路由树，生成路由

```react
const ROUTERS: Routes = [
  {
    path: "/path1",
    component: <AppOne />,
  },
  {
    path: "/path2",
    component: <AppTwo />,
  },
  {
    path: "/path3",
    // children 中的路由平级, 且与 "/path1"、"/path2" 平级
    children: [
      {
        index: true, // 相当于 'path: "/path3"'
        component: <AppThree />,
      },
      {
        // path: "/path3/:id",
        // 或
        path: "/:id", // 会自动添加 "/path3"，相当于 "/path3/:id"
        component: <AppThreeOne />,
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

路由跳转

```react
import React, { useEffect } from "react";
import { useNavigate } from "@hsu-react/single-router";
...

const App: React.FC = () => {
  ...

  const navigate = useNavigate();

  useEffect(() => {
      navigate("/path1");
  }, [navigate]);

  ...
};

```

### `useLocation`

获取当前路由

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
    // {pathname: '', history: [], index: 0}
    console.log(location)
  }, [location]);

  ...
};

```

### `useParams`

获取动态路由参数

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

## License

MIT
