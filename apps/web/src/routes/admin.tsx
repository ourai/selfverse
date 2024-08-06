import type { RouteObject } from 'react-router-dom';
import AdminLayout from '../layouts/admin';
import AdminWorksList from '../pages/admin-works-list';

export default {
  path: '/cellar',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <AdminWorksList />,
    },
  ],
} as RouteObject;
