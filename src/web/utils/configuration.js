function Configuration() {
  let configuration = {};

  return {
    init({ NODE_ENV, HOST, PORT }) {
      configuration = {
        NODE_ENV,
        HOST,
        PORT,
        API: `${window.location.protocol}//${HOST}:${PORT}`
      };
    },
    get config() { return configuration; }
  };
}

export default new Configuration();
