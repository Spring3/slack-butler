function getTitles(links) {
  const refs = Array.isArray(links) ? links : [links];
  const payload = [];
  // setting up link title
  for (const link of refs) {
    const urlObj = url.parse(link);
    const pathname = urlObj.pathname.replace(urlObj.pathname.search, '');
    let linkParts;
    if (pathname.charAt(pathname.length - 1) === '/') {
      linkParts = pathname.substring(0, pathname.length - 1).split('/');
    } else {
      linkParts = urlObj.split('/');
    }
    let linkTitle = linkParts.pop().replace(/-/g, ' ');
    // if name was not set or it is a number
    if (!linkTitle || /^\d+$/.test(linkTitle)) {
      // just taking the website name as a caption for the link
      linkTitle = linkParts[0];
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
}
