// import express = require('express');
// import bodyParser = require('body-parser');
// import { Routes } from './routes';
// const EXPRESS_PORT = 3000;

// const closeApp = require('./index');

// var app: express.Express = express();

// app.use(bodyParser.urlencoded( { limit: '10mb', extended: true }));
// app.use(bodyParser.json( { limit: '10mb' }));

// async function initExpress(app: any){
//   Routes.listenedRoutes(app);
//   console.log("Initializing Express instance...");
//   app.listen(EXPRESS_PORT, ()=>{
//       console.log(`App listening on port ${EXPRESS_PORT}.`);
//   });
//   process.on("SIGINT", closeApp);
//   process.on("SIGTERM", closeApp);
// }

// module.exports = app, initExpress;