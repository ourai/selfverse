import type { RouteObject } from 'react-router-dom';
import VisitorLayout from '../layouts/visitor';
import WorksList from '../pages/visitor-works-list';
import WorksItem from '../pages/visitor-works-item';
import Donation from '../pages/visitor-donation';

export default {
  path: '/',
  element: <VisitorLayout />,
  children: [
    {
      path: '',
      element: <div>Visitor homepage</div>
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
  ],
} as RouteObject;