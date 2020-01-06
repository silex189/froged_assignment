import express = require('express');
const mongo: any = require("./db/connect");
import bodyParser = require('body-parser');
import { Routes } from './routes';
const EXPRESS_PORT = 3000;

var app: express.Express = express();

app.use(bodyParser.urlencoded( { limit: '10mb', extended: true }));
app.use(bodyParser.json( { limit: '10mb' }));

async function initApp(){
    const db = await mongo.connect();
    if (db) { initExpress(); }
}

async function initExpress(){
    Routes.listenedRoutes(app);
    console.log("Initializing Express instance...");
    app.listen(EXPRESS_PORT, ()=>{
        console.log(`App listening on port ${EXPRESS_PORT}.`);
    });
    process.on("SIGINT", closeApp);
    process.on("SIGTERM", closeApp);
}

function closeApp(){
    mongo.disconnect()
        .then(()=>process.exit(0));
}

initApp();