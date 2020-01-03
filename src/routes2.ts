import { Express, Request, Response, NextFunction } from 'express';
import { AuthorizationRoutes } from './controllers/authorizations';

import { slugs } from './db/authorizedSlugs';

export interface iPipe {
    slug: string
  }

export class Routes
  {

    static listenRoutes(app: Express) {
      
      const slugIsFound = (slugName: String): boolean => {
        for(let i = 0; i <= slugs.length; i++){
          if (slugs[i].name === slugName)
            return true;
        }
        return false;
      }
        app.get('/', function (req, res) {
            res.json({ message: "Hello World"})
          });
        app.use('/ws/:slug', (req: Request, res: Response, next: NextFunction) => {
            let slug: string = String(req.params.slug);
            let pipe: iPipe = { slug };
            res.locals.pipe = pipe;
            // if(slug != null) {
            if (slugIsFound(slug)) {
              next();
            } else next(new Error("Pon tu slug!!"))

          });
        app.use('/ws/:slug/authorizations', AuthorizationRoutes);

        app.use('', (req: Request, res: Response, next: NextFunction) => {
            console.log("saving new application");

            


            res.json({ ok: true });
          });
        app.use('', (err: Error, req: Request, res: Response, next: NextFunction) => {
            res.json({ ok: false });
          });

      }
  }

