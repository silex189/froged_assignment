import express = require('express');
const mongo: any = require("./db/connect");
import bodyParser = require('body-parser');
import { Routes } from './routes';
const EXPRESS_PORT = 3000;

var app: express.Express = express();

app.use(bodyParser.urlencoded( { limit: '10mb', extended: true }));
app.use(bodyParser.json( { limit: '10mb' }));

Routes.listenedRoutes(app);

// new
async function initDB(){
    const db = await mongo.connect();
    if (db) { initExpress(); }
}

async function initExpress(){
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

initDB();



// ejemplo de atacar a la db
// const db = mongo.instance().db("froged");
// const card = await db.collection("cards").find({}).toArray();

// console.log("This is the master test" + card[0].name);