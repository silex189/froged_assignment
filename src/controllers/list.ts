import { Request, Response } from "express";
import List = require('../models/list');

export function getLists(req: Request, res: Response) {
  List.find({}, (err, lists) => {
    if (err) return res.status(500).send({ message: `Error: ${err}`});
    if (!lists) return res.status(404).send({ message: `Thera are no lists`});

    res.status(200).send({ lists });
  })
};

export function getList(req: Request, res: Response) {
  let listId = req.params.listId;

  List.findById(listId, (err, list) => {
    if (err) return res.status(500).send({ message: `Error: ${err}`});
    if (!list) return res.status(404).send({ message: `Not found` });

    res.status(200).send({ list });
  })
}