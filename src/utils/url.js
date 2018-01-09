const url = require('url');

function getTitles(links) {
  const data = [null, undefined].includes(links) ? [] : links;
  const refs = Array.isArray(data) ? data : [data];
  const payload = [];
  // setting up link title
  for (const link of refs) {
    const { pathname } = url.parse(link);
    let linkParts;
    if (pathname.charAt(pathname.length - 1) === '/') {
      linkParts = pathname.substring(0, pathname.length - 1).split('/');
    } else {
      linkParts = pathname.split('/');
    }
    let linkTitle = linkParts[linkParts.length - 1].replace(/-/g, ' ');
    // if name was not set or it is a number
    if (!linkTitle || /^\d+$/.test(linkTitle)) {
      // just taking the website name as a caption for the link
      linkTitle = linkParts[0]; // eslint-disable-line
    }
    payload.push({
      caption: linkTitle.replace(linkTitle.charAt(0), linkTitle.charAt(0).toUpperCase()),
      href: link,
    });
  }
  return payload;
}

module.exports = {
  getTitles
};
