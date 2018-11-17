# MediVRx-Unity-MediaServer

This is the MediVRx server configuration designed to handle data collection and content section storage.

# Installation

## Project setup

```
npm install
```

## Sails server
```
sails lift or node app.js
```
> NODE_ENV=production node app.js

## Real-time compilation in dev environment
```
npm install forever -g
npm install forever --save-dev
forever -w start app.js
forever logs app.js -f
```

## Electron 

### Application config
- Development
> when development env, create `config/local.js` file and edit like this
```
module.exports = {
  ssl: {
      ca: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/rootCA.crt')),
      key: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/server.key')),
      cert: require('fs').readFileSync(require('path').resolve(__dirname, '../config/ssl/server.crt'))
    },
  
    baseUrl: 'https://your_ip',
    explicitHost: 'your_ip',
    port: 443,
}
```
It's not working with `localhost`.

- Production
```
  baseUrl: 'https://104.45.154.157',
  explicitHost: '104.45.154.157',
```


### App startup
```
npm start
```
then will running the commands both `electron .` and `sails lift` 

### Build up
```
npm run dist
```
app location is `./dist/mac`.

## REST API Documentation
```
https://localhost/docs
```
