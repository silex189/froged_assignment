const mongoose = require('mongoose');
const app = require('./app');
import { DB, EXPRESS_PORT } from './config';


function initDB() {
  const mongooseOptions = { useNewUrlParser: true, useUnifiedTopology: true };
 
  mongoose.connect(DB, mongooseOptions, (err: any, req: any) => {
    if (err) {
      return console.log(`Error: ${err}`);
    }
    
    console.log(`DB connection stablished...`);
    initApp();
  })
}

function initApp() {
  app.listen(EXPRESS_PORT, () => {
    console.log(`App listening on port ${EXPRESS_PORT}...`);
  })
}
initDB();