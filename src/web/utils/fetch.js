import 'isomorphic-fetch';

export default function loadData({ protocol = 'https:', method, host, route, headers = {}, query, body, url }) {
  let uri = url || `${protocol}//${host}${route}`;
  const options = {
    crossDomain: true,
    headers: {
      'Content-Type': 'text/html',
      ...headers
    },
    method
  };

  if (method === 'GET' && query) {
    uri += `?${query}`;
  }

  if (method !== 'GET' && body) {
    requestData.body = JSON.stringify(body);
  }

  return fetch(uri, options).then(res => res.json());
};
