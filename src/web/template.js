module.exports = ({ body, title, initialState }) => `
  <!DOCTYPE html>
    <html>
      <head>
        <script>
          window.__APP_INITIAL_STATE__ = ${initialState}
        </script>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>${title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="root">${body}</div>
      </body>
      <script src="/assets/bundle.js"></script>
    </html>
`;
