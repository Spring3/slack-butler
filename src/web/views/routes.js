import Root from './RootPage';
import Dashboard from './DashboardPage';
import NotFound from './NotFound';

const Routes = [
  {
    path: '/',
    exact: true,
    component: Root
  },
  {
    path: '/dashboard',
    exact: true,
    auth: true,
    component: Dashboard
  },
  {
    path: '/notfound',
    component: NotFound
  }
];

export default Routes;
