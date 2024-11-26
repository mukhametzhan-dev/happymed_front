import { Alert } from 'antd';
import { createBrowserRouter } from 'react-router-dom';
import { invalidRoutes } from './invalidRoutes';
import { privateRoutes } from './privateRoutes';
import { publicRoutes } from './publicRoutes';

const routes = [...publicRoutes, ...privateRoutes, ...invalidRoutes].map(
  (route) => ({ ...route, ErrorBoundary: Alert.ErrorBoundary })
);

export const router = createBrowserRouter(routes, {
  future: {
    v7_normalizeFormMethod: true,
  },
});
