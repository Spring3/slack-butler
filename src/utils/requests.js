function fetchAllPages(requestFn) {
  return async function (requestData) {
    const results = {
      ok: [],
      error: []
    };
    let cursor;
    do {
      const nextRequestParams = Object.assign({}, requestData);
      if (cursor) {
        nextRequestParams.cursor = cursor;
      }
      const result = await requestFn(nextRequestParams);
      if (result.ok) {
        results.ok.push(result);
        cursor = result.response_metadata.next_cursor;
      } else {
        results.error.push(result);
        cursor = undefined;
      }
    } while (cursor);
    return results;
  };
}

module.exports = {
  fetchAllPages
};
