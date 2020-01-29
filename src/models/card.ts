import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  trelloCardId: Number,
  name: String,
})

export = mongoose.model('Card', CardSchema);
