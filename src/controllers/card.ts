import { Request, Response } from "express";
const Card = require('../models/card');

export function getCards(req: Request, res: Response) {
  Card.find({}, (err: Error, cards: any) => {
    if (err) {
      return res.status(500).send({ message: `Error: ${err}`});
    }
    if (!cards) {
      return res.status(400).send({ message: `Thera are no cards`});
    }

    res.status(200).send({ cards });
  })
}