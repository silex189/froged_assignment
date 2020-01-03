import { Express, Request, Response, NextFunction } from 'express';
import bodyParser = require('body-parser');
const mongo: any = require("./db/connect");
const DB_NAME = "froged";

export class Routes {

    static listenedRoutes(app: Express) {

        // test
        app.get('/', async function (req, res) {

            const db = mongo.instance().db(DB_NAME);
            const card = await db.collection("cards").find({}).toArray();

            // res.json( 
            //     { message: "/ directory", 
            //       mongoMessage: card[0].name 
            //     }
            // );
            const body = req.body;
            res.json(body.name);
        });


        // assignment
        app.post("/lists", async function(req,res) {
            const body = req.body;

            const trelloListId = body.trelloListId;
            const name = body.name;

            const db = mongo.instance().db(DB_NAME);
            await db.collection("lists").insert( 
                {
                    trelloListId: `${trelloListId}`,
                    name: `${name}`
                });

            res.json( 
                { 
                    message: "POST /lists", 
                    response_body: { 
                        trelloListId: body.trelloListId, 
                        name: body.name 
                    }  
                });
        })

        app.put(`/lists/:idList`, async function(req, res) {
            const idList = req.params.idList;
            const name = req.body.name;

            const db = mongo.instance().db(DB_NAME);
            await db.collection("lists").updateOne( 
                { 
                    trelloListId: `${idList}`
                }, 
                { $set: 
                    { 
                        name: `${name}`
                    }
                })


            res.json(
                { 
                    message: `PUT /lists ${idList}, body: ${req.body}`,
                    response_body: {
                        trelloListId: `${idList}`,
                        name: `${name}`
                    }
                 });
        })

        app.get('/lists', async function(req, res) {
            
            const db = mongo.instance().db(DB_NAME);
            const lists = await db.collection("lists").find().toArray();


            res.json( 
                { 
                    message: `GET /lists`,
                    lists: lists
                })
        })


        app.get('/lists/:idList', async function(req, res) {
            let idList = req.params.idList;

            const db = mongo.instance().db(DB_NAME);
            const list = await db.collection("lists").findOne(
                {
                    trelloListId: `${idList}`
                }
            )

            res.json( 
                { 
                    message: `GET /lists ${idList}`,
                    list: list
                });
        })

        app.post('/lists/:idList/cards', async function(req, res) {
            const idList = req.params.idList;
            const body = req.body;
            
            const db = mongo.instance().db(DB_NAME);
            await db.collection("lists").updateOne(
                {
                    trelloListId: idList,
                },
                {
                    $push: {
                        cardsList: {
                            $each: [
                                {
                                    trelloCardId: `${body.trelloCardId}`,
                                    name: `${body.name}`
                                }
                            ]
                        }
                    }
                }
                )
                
                res.json( 
                    { 
                        message: `POST /lists ${idList} /cards`,
                        card: body
                    });
                });
                
                
        app.put('/lists/:idList/cards/:idCard', async function(req, res) {
            let idList = req.params.idList;
            let idCard = req.params.idCard;
            let newCardName = req.body.newName;

            const db = mongo.instance().db(DB_NAME);
            
            const trelloList = await db.collection("lists").findOne( 
                { trelloListId: idList });
                
                
            let trelloCard;
            
            for(let i = 0; i < trelloList.cardsList.length; i++) {
                if (trelloList.cardsList[i].trelloCardId === idCard) {
                    trelloList.cardsList[i].name = newCardName;
                    trelloCard = trelloList.cardsList[i];
                }
            }

            await db.collection("lists").updateOne( 
                {
                    trelloListId: idList
                },
                {
                    $pull:
                    {
                        cardsList: {
                            trelloCardId: idCard
                        }
                    }
                })
            await db.collection("lists").updateOne(
                {
                    trelloListId: idList
                },
                {
                    $push: {
                        cardsList: trelloCard
                    }
                });

            res.json( 
                { 
                    message: `PUT /lists ${idList} /cards ${idCard}`,
                    card: { 
                        idCard: trelloCard.trelloCardId,
                        cardName: trelloCard.name
                    }
                });

        });


        app.put('/lists/:idList/cards/:idCard/to/:idDestinationList', async function (req, res) {
            let idList = req.params.idList;
            let idCard = req.params.idCard;
            let idDestinationList = req.params.idDestinationList;

            const db = mongo.instance().db(DB_NAME);
            const prevTrelloList = await db.collection("lists").findOne( 
                { 
                    trelloListId: idList 
                });

            let trelloCard;

            for(let i = 0; i < prevTrelloList.cardsList.length; i++) {
                if (prevTrelloList.cardsList[i].trelloCardId === idCard) {
                    trelloCard = prevTrelloList.cardsList[i];
                }
            }

            await db.collection("lists").updateOne( 
                {
                    trelloListId: idList
                },
                {
                    $pull:
                    {
                        cardsList: {
                            trelloCardId: idCard
                        }
                    }
                });

            await db.collection("lists").updateOne(
                {
                    trelloListId: idDestinationList
                },
                {
                    $push: {
                        cardsList: trelloCard
                    }
                });
            
            res.json( 
                { 
                    message: `PUT /lists ${idList} /cards ${idCard} /to ${idDestinationList}`,
                    card: { 
                        idCard: trelloCard.trelloCardId,
                        cardName: trelloCard.name
                    }
                });
        });

        app.delete('/lists/:idList/cards/:idCard', async function(req, res) {
            let idList = req.params.idList;
            let idCard = req.params.idCard;
            
            const db = mongo.instance().db(DB_NAME);
            
            await db.collection("lists").updateOne( 
                {
                    trelloListId: idList
                },
                {
                    $pull:
                    {
                        cardsList: {
                            trelloCardId: idCard
                        }
                    }
                });
 
            res.json( 
                { 
                    message: `DELETE /lists ${idList} /cards ${idCard}`,
                    info: `card with id: ${idCard} from list with id: ${idList} was deleted`
                });
            });
                
                
        app.delete('/lists/:idList', async function(req, res) {
            let idList = req.params.idList;

            const db = mongo.instance().db(DB_NAME);

            await db.collection("lists").deleteOne(
                {
                    trelloListId: idList
                }
            )

            res.json( 
                { 
                    message: `DELETE /lists ${idList}`,
                    info: `list with id: ${idList} was deleted`
                });
        })


        app.get('/board', function(req, res) {

            res.json( { message: `GET /board`});
        })
    }
}
