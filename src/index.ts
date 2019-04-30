import path from 'path';

import bodyParser from 'body-parser';
import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import hbs from 'hbs';
import {Op} from 'sequelize';

import db from './db';
import { Adventure } from './models/Adventure';
import { Hashtag } from './models/Hashtag';
import adventureRoute from './routes/adventures';
import hashtagRoute from './routes/hashtags';
import sceneRoute from './routes/scenes';

const app = express();

app.set('view engine', 'hbs');

const viewsDir = path.join(__dirname, 'views');

const partialsDir = path.join(viewsDir, 'partials');

const publicDir = path.join(__dirname, 'public');

app.set('views', viewsDir);

app.use(bodyParser.json());

app.use(express.static(publicDir));

app.use('/hashtag', hashtagRoute);

app.use('/scene', sceneRoute);

app.use('/', adventureRoute);

app.get('/api/hashtags' , (req, res) => {
    const partOfHashtag = req.query.filter;

    Hashtag
      .findAll({where: {name: {[Op.like]: `%${partOfHashtag}%`}}})
      .then((hashtags) => res.json(hashtags));

});

app.post('/api/adventures' , (req, res) => {
  const partOfAdventure: string = req.body.adventure;
  const hashtagsSearch: string[] = req.body.hashtags;
  console.info(hashtagsSearch);
  const limit = req.query.limit;
  const offset = req.query.offset;

  let where = {};
  if (partOfAdventure) {
    where = {
        [Op.or] : [
          {name: {[Op.iLike]: `%${partOfAdventure}%`}},
          {text: {[Op.iLike]: `%${partOfAdventure}%`}}
        ]
      };
  }

  let include: any[] = [];
  if (hashtagsSearch.length) {
    include = [{
      model: Hashtag,
      where: {name: {[Op.in] : hashtagsSearch}},
    }];
  }

  Adventure.findAll({
    attributes: ['id'],
    include,
    limit,
    offset,
    where
  }).then((adventures) => {
   return Adventure.findAll({
      include: [{model: Hashtag}],
      where: {
        id: {[Op.in]: adventures.map((adventure) => adventure.id)}
      }
    });
  }).then((adventures) => res.json(adventures));
});

const error404 = (_req: Request, res: Response) => res.sendStatus(404);

app.all('*', error404);

app.use((err: Error, _req: Request, res: Response, _next: Next) => {
  console.error(err.stack);

  res.sendStatus(500);
});

db.authenticate()
  .then(() => console.info('database connected'))
  .catch((err: any) => {
    console.info(err);
  });

hbs.registerHelper('if_eq', function(this: any, a, b, opts) {
    if (a === b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hbs.registerPartials(partialsDir, () => {
  const _port = config.get('port');

  app.listen(_port, () => {
      console.info(`Server started on ${_port}`);
      console.info(`Open http://localhost:${_port}/`);
  });
});
