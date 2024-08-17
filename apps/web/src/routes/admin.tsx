import { type RouteObject, Navigate } from 'react-router-dom';

import AdminLayout from '../layouts/admin';
import AdminArticleList from '../pages/admin-article-list';
import AdminWorksList from '../pages/admin-works-list';
import AdminDonation from '../pages/admin-donation';
import AdminFunds from '../pages/admin-funds';

export default {
  path: '/cellar',
  element: <AdminLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/cellar/articles" replace />
    },
    {
      path: 'articles',
      element: <AdminArticleList />,
    },
    {
      path: 'works',
      element: <AdminWorksList />,
    },
    {
      path: 'donation',
      element: <AdminDonation />,
    },
    {
      path: 'funds',
      element: <AdminFunds />,
    },
  ],
} as RouteObject;
