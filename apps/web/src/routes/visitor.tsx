import { type RouteObject, Navigate } from 'react-router-dom';

import VisitorLayout from '../layouts/visitor';
import ArticleList from '../pages/visitor-article-list';
import ArticleItem from '../pages/visitor-article-item';
import WorksList from '../pages/visitor-works-list';
import WorksItem from '../pages/visitor-works-item';
import Donation from '../pages/visitor-donation';
import Profile from '../pages/visitor-profile';

export default {
  path: '/',
  element: <VisitorLayout />,
  children: [
    {
      path: '',
      element: <Navigate to="/articles" replace />
    },
    {
      path: 'articles',
      element: <ArticleList />,
    },
    {
      path: 'articles/:id',
      element: <ArticleItem />,
    },
    {
      path: 'works',
      element: <WorksList />,
    },
    {
      path: 'works/:id',
      element: <WorksItem />,
    },
    {
      path: 'donation',
      element: <Donation />,
    },
    {
      path: 'profile',
      element: <Profile />,
    },
  ],
} as RouteObject;
