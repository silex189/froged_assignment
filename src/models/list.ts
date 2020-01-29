import mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ListSchema = new Schema({
  trelloListId: String,
  name: String,
  cardList: Array
})

export = mongoose.model('List', ListSchema);