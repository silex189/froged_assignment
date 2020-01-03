const MongoClient = require('mongodb').MongoClient;
const DB_NAME = "froged";
const DB_HOST = "localhost";
const DB_PORT = 27017;
const connectionUrl = `mongodb://${DB_HOST}:${DB_PORT}`;


module.exports = (()=>{
    let instance: any = null,
        isDisconnecting = false;

    function connect() {
        return new Promise((resolve, reject)=>{
            MongoClient.connect(connectionUrl, { useNewUrlParser: true }, function(err: any, client: any) {
                if (err) { reject(err); }
                console.log("MongoDB connection established!");
                instance = client;
                resolve(client.db(DB_NAME));
            });
        });
    }

    function disconnect(){
        if (instance && !isDisconnecting){
            isDisconnecting = true;
            console.log("Desconnecting MongoDB instance...");
            return new Promise((resolve, reject)=>{
                instance.close((err: any, result: any)=>{
                    if (err) { reject(err); isDisconnecting=false; return; }
                    console.log("MongoDB instance disconnected!");
                    resolve();
                });
            })
        }
    }

    return {
        connect,
        disconnect,
        instance: ()=>instance,
    }
})();