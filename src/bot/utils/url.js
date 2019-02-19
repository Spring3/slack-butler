const assert = require('assert');
const url = require('url');
const ogs = require('open-graph-scraper');

/**
 * Get link titles based on the link name
 * @param  {string} link - a single link
 * @return {[object]]}
 */
function parseOGP(link) {
  // setting up link title
  const { pathname, hostname } = url.parse(link);
  const linkParts = pathname.charAt(pathname.length - 1) === '/'
    ? pathname.slice(0, -1).split('/')
    : pathname.split('/');
  let linkTitle = linkParts[linkParts.length - 1].replace(/-/g, ' ');
  // if name was not set or it is a number
  if (!linkTitle || /^\d+$/.test(linkTitle)) {
    // just taking the website name as a caption for the link
    linkTitle = linkParts[0]; // eslint-disable-line
  }
  return {
    ogSiteName: hostname,
    ogTitle: `${linkTitle.charAt(0).toUpperCase()}${linkTitle.slice(1)}`,
    ogUrl: link,
    ogImage: {}
  };
}

function forMany(items, func) {
  assert(Array.isArray(items), 'items has to be an array');
  assert.equal(typeof func, 'function', 'func must have type function');
  return items.map(func);
}

function forManyAsync(items, func) {
  return Promise.all(forMany(items, func));
}

function fetchOGP(link) {
  return ogs({
    onlyGetOpenGraphInfo: true,
    url: link,
    encoding: 'utf8',
    headers: { 'accept-language': 'en' }
  }).then(({ data, success }) => {
    if (success && data.ogUrl) {
      return { ogp: data, href: link };
    }
    return { href: link, ogp: { ...data, ...parseOGP(link) } };
  }).catch(e => console.error(`Error during OGP data fetching from url ${link}`, e.message));
}

module.exports = {
  parseOGP,
  fetchOGP,
  forMany,
  forManyAsync
};
