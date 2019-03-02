import Root from '../web/views/RootPage';
import Dashboard from '../web/views/DashboardPage';
import NotFound from '../web/views/NotFound';
import loadData from '../web/utils/fetch.js';

const { HOST, PORT, ENABLE_HTTPS } = require('../modules/configuration.js');

module.exports = [
  {
    path: '/',
    exact: true,
    component: Root
  },
  {
    path: '/dashboard',
    exact: true,
    auth: true,
    loadData: (options) => loadData({
      method: 'GET',
      protocol: ENABLE_HTTPS ? 'https:' : 'http:',
      host: `${HOST}:${PORT}`,
      route: '/dashboard/links',
      ...options
    }),
    component: Dashboard
  },
  {
    path: '/notfound',
    component: NotFound
  }
];
