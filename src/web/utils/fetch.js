import 'isomorphic-fetch';

export default function loadData({ protocol = 'https:', method, host, route, headers = {}, query, body }) {
  let uri = `${protocol}//${host}${route}`;
  const options = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
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
