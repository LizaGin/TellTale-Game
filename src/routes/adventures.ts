import config from 'config';
import express from 'express';
import { Adventure } from '../models/Adventure';
import { Hashtag } from '../models/Hashtag';

const adventureRouter = express.Router();

const staticBasePath = config.get('staticBasePath');

adventureRouter.get('/', (_req, res) =>
    Adventure.findAll({
        include: [{
                model: Hashtag
            }]
        })
        .then((adventures) => {
            const data = {staticBasePath, adventures};
            res.render('adventures', data);
        })
);

export = adventureRouter;
