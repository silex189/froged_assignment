import { Express, Request, Response, NextFunction } from 'express';
import bodyParser = require('body-parser');
const mongo: any = require("./db/connect");
const DB_NAME = "froged";

export class Routes {

    static listenedRoutes(app: Express) {
        const db = mongo.instance().db(DB_NAME);
        
        // test
        app.get('/', async (req, res) => {
            const message = req.body.message;
            
            res.status(200).json(
                {
                    URL: "GET /",
                    request_body: {
                        message: message
                    }
                });
        });

        // assignment
        app.post("/lists", async function(req,res) {
            const trelloListId = req.body.trelloListId;
            const name = req.body.name;
            const cardsList = req.body.cardsList;

            await db.collection("lists").insertOne( 
                {
                    trelloListId: `${trelloListId}`,
                    name: `${name}`,
                    cardsList: cardsList
                });

            res.status(200).json( 
                { 
                    URL: "POST /lists",
                    message: "Creating a list from body data",
                    request_body: { 
                        trelloListId: trelloListId, 
                        name: name,
                        cardsList: cardsList
                    }  
                });
        })

        app.put(`/lists/:idList`, async function(req, res) {
            const idList = req.params.idList;
            const name = req.body.name;

            await db.collection("lists").updateOne( 
                { 
                    trelloListId: `${idList}`
                }, 
                { $set: 
                    { 
                        name: `${name}`
                    }
                })

            res.status(200).json(
                { 
                    URL: `PUT /lists /idLists: ${idList}`,
                    message: "Updating a list name",
                    request_body: req.body
                    
                 });
        })

        app.get('/lists', async function(req, res) {

            const lists = await db.collection("lists").find().toArray();

            res.status(200).json( 
                { 
                    URL: "GET /lists",
                    message: "showing all lists from DB",
                    lists: lists
                })
        })


        app.get('/lists/:idList', async function(req, res) {
            const idList = req.params.idList;

            const list = await db.collection("lists").findOne(
                {
                    trelloListId: `${idList}`
                }
            )

            res.status(200).json( 
                { 
                    URL: `GET /lists /idLists: ${idList}`,
                    message: "showing a concrete list from DB",
                    list: list
                });
        })

        app.post('/lists/:idList/cards', async function(req, res) {
            const idList = req.params.idList;
            const body = req.body;
            
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
                
            res.status(200).json( 
                { 
                    URL: `POST /lists /idList: ${idList} /cards`,
                    message: "posting a card in a list",
                    card: body
                });
            });
                       
        app.put('/lists/:idList/cards/:idCard', async function(req, res) {
            const idList = req.params.idList;
            const idCard = req.params.idCard;
            const newCardName = req.body.newName;

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

            res.status(200).json( 
                { 
                    URL: `PUT /lists /idList: ${idList} /cards /idCard: ${idCard}`,
                    message: "renaming a card",
                    card: { 
                        idCard: trelloCard.trelloCardId,
                        newCardName: trelloCard.name
                    }
                });

        });

        app.put('/lists/:idList/cards/:idCard/to/:idDestinationList', async function (req, res) {
            const idList = req.params.idList;
            const idCard = req.params.idCard;
            const idDestinationList = req.params.idDestinationList;

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
            
            res.status(200).json( 
                { 
                    URL: `PUT /lists /idList: ${idList} /cards /idCard: ${idCard} /to /idDestinationList: ${idDestinationList}`,
                    message: "moving a card from a list to another one",
                    card: trelloCard
                });
        });

        app.delete('/lists/:idList/cards/:idCard', async function(req, res) {
            const idList = req.params.idList;
            const idCard = req.params.idCard;
            
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
 
            res.status(200).json( 
                { 
                    URL: `DELETE /lists /idList: ${idList} /cards /idCard: ${idCard}`,
                    message: "Deleting a card from a list",
                    info: `card with id: ${idCard} from list with id: ${idList} was deleted`,
                });
        });
                 
        app.delete('/lists/:idList', async function(req, res) {
            const idList = req.params.idList;

            await db.collection("lists").deleteOne(
                {
                    trelloListId: idList
                }
            )

            res.status(200).json( 
                { 
                    URL: `DELETE /lists /idList: ${idList}`,
                    message: "deleting a list",
                    info: `list with id: ${idList} was deleted`
                }
            );
        })

        app.get('/board', async function(req, res) {

            let lists = await db.collection("lists").find().toArray();

            function dynamicSort(property: any) {
                let sortOrder = 1;
            
                if (property[0] === "-") {
                    sortOrder = -1;
                    property = property.substr(1);
                }
            
                return function (a: any,b: any) {
                    if(sortOrder == -1){
                        return b[property].localeCompare(a[property]);
                    } else {
                        return a[property].localeCompare(b[property]);
                    }        
                }
            }

            lists.sort(dynamicSort("name"));
            
            for(let i = 0; i < lists.length; ++i) {
                lists[i].cardsList.sort(dynamicSort("name"))
            }

            res.status(200).json( 
                { 
                    URL: `GET /board`,
                    message: "showing all lists alphabetically sorted",
                    sortedLists: lists
                });
        })
    }
}