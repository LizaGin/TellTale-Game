import path from 'path';

import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import hbs from 'hbs';

import db from './db';
import adventureRoute from './routes/adventures';
import hashtagRoute from './routes/hashtags';
import sceneRoute from './routes/scenes';

const app = express();

app.set('view engine', 'hbs');

const viewsDir = path.join(__dirname, 'views');

const partialsDir = path.join(viewsDir, 'partials');

const publicDir = path.join(__dirname, 'public');

app.set('views', viewsDir);

app.use(express.static(publicDir));

app.use('/hashtag', hashtagRoute);

app.use('/scene', sceneRoute);

app.use('/', adventureRoute);

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
