module.exports = ({ jsxString, title, initialState, styles }) => `
    <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>${title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${styles}
          <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
          <script>
            window.__APP_INITIAL_STATE__ = ${initialState}
          </script>
          <style>
            body {
              margin: 0;
              font-family: 'Roboto', sans-serif;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div id="root">${jsxString}</div>
          <script src="/browser.js"></script>
        </body>
      </html>
`
