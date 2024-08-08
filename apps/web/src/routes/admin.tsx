import { type RouteObject, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/admin';
import AdminWorksList from '../pages/admin-works-list';
import AdminDonation from '../pages/admin-donation';

export default {
  path: '/cellar',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/cellar/works" replace />
    },
    {
      path: 'works',
      element: <AdminWorksList />,
    },
    {
      path: 'donation',
      element: <AdminDonation />,
    },
  ],
} as RouteObject;
