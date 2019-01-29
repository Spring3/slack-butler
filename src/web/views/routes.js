import Root from './RootPage';
import Dashboard from './DashboardPage';
import Favorites from './FavoritesPage';
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
    component: Dashboard
  },
  {
    path: '/dashboard/favorites',
    component: Favorites
  },
  {
    path: '/notfound',
    component: NotFound
  }
];

export default Routes;
