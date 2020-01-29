import { Router } from 'express';
const api = Router();
import cardController = require('../controllers/card');
import listController = require('../controllers/list');


api.get('/', (req, res) => {
  const message = req.body.message;

  res.status(200).json({
    URL: "GET /",
    request_body: {
      message: message
    }
  })
});

api.get('/card', cardController.getCards);
api.get('/list', listController.getLists);
api.get('/list/:listId', listController.getList);


module.exports = api;