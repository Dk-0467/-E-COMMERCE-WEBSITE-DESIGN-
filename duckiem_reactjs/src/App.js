import * as React from "react";
import { useRoutes } from "react-router-dom";
import LayoutFrontend from './layouts/frontend/index';
import LayoutBackend from './layouts/backend/index';
import RouterFrontend from './router/RouterFrontend';
import RouterBackend from './router/RouterBackend';
import PrivateRoute from './router/PrivateRoute'; // Import PrivateRoute
import Login from './pages/backend/Login/Login';

function App() {
  let element = useRoutes([
    {
      path: "/",
      element: <LayoutFrontend />,
      children: RouterFrontend,
    },
    {
      path: "/admin",
      element: (
        <PrivateRoute>
          <LayoutBackend />
        </PrivateRoute>
      ),
      children: RouterBackend,
    },
    { path: "/admin/login", element: <Login /> },
    // { path: "*", element: <NotFound /> },
  ]);

  return element;  
}

export default App;
