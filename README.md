# MediVRx-Unity-MediaServer

This is the MediVRx server configuration designed to handle data collection and content section storage.

# Installation

## Project setup

```
npm install
```

# Development

1. Start sails server
2. Run electron 
3. Both
`npm start or npm run dev`
## Sails Server
```
npm run serve
```
> running port: http://localhost:1337

Production Server
```
sudo pm2 start app.js
```
When app process is running, please restart with this command,
```
sudo pm2 stop app && pm2 start app
```

## Electron 

### App running on local
```
npm run electorn
```

### App building
```
npm run build or npm run build:dir
```

## REST API Documentation
```
http://localhost:1337/docs
```

