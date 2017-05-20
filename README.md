### Slack bot

Collects links, posted to the main channel (@see ``.env.tpl``) and displays them in a reactive way :)

### Tech stack:
- slack api
- es7
- express
- pug
- react
- redux
- webpack 2
- babel


### Running in dev mode:
```
  npm i -g nodemon
  npm i
  npm run webpack

  // in the new terminal window
  npm run dev
```

This will run the webpack, that will be watching after the files.

The second command runs the ``nodemon`` ad tracks the javascript part of the project

### Running in prod mode
```
  npm i
  NODE_ENV=production npm start
```

### Dev status:
- Bot - seems to be ready (done all that was planned)
- Web - set up dev environment
