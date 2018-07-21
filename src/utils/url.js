const url = require('url');

/**
 * Get link titles based on the link name
 * @param  {Array|string} links - array of links or a single link
 * @return {[object]]}
 */
function getCaption(links) {
  const payload = [];
  // setting up link title
  for (const link of links) {
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
    payload.push({
      caption: `${linkTitle.charAt(0).toUpperCase()}${linkTitle.slice(1)}`,
      domain: hostname,
      href: link,
    });
  }
  return payload;
}

module.exports = {
  getCaption
};
