// Import path from 'path';

import bodyParser from 'body-parser';
import config from 'config';
import express, {NextFunction as Next, Request, Response} from 'express';
import 'isomorphic-fetch';
import nextjs from 'next';
import {Op} from 'sequelize';

import {parse} from 'url';
import {adventureRouter} from './controllers/adventures';
import {hashtagRouter} from './controllers/hashtags';
import {sceneRouter} from './controllers/scenes';
import {userSignIn, userSignUp} from './controllers/user';
import db from './db';
import render from './middlewares/render';
import {Adventure} from './models/Adventure';
import {Hashtag} from './models/Hashtag';
import { UserAdventure } from './models/UserAdventure';
import { User } from './models/User';

const app = express();

// Const publicDir = path.join(__dirname, 'public');

const nextApp = nextjs({dev: process.env.NODE_ENV !== 'production'});

// App.use(express.static(publicDir));

app.use(bodyParser.json({limit: '10mb'}));

app.use(render(nextApp));

app.use('/api/hashtag/:hashtag', hashtagRouter);

app.use('/api/scene/:id', sceneRouter);

app.post('/api/adventures', (req, res) => {
    const partOfAdventure: string = req.body.adventure;
    const hashtagsSearch: string[] = req.body.hashtags;
    const limit = req.query.limit;
    const offset = req.query.offset;

    let where = {};
    if (partOfAdventure) {
        where = {
            [Op.or]: [
                {name: {[Op.iLike]: `%${partOfAdventure}%`}},
                {text: {[Op.iLike]: `%${partOfAdventure}%`}}
            ]
        };
    }

    let include: any[] = [];
    if (hashtagsSearch.length) {
        include = [
            {
                model: Hashtag,
                where: {name: {[Op.in]: hashtagsSearch}}
            }
        ];
    }

    Adventure.findAll({
        attributes: ['id'],
        include,
        limit,
        offset,
        where
    })
        .then(adventures => {
            return Adventure.findAll({
                include: [{model: Hashtag}, {model: User}],
                where: {
                    id: {[Op.in]: adventures.map(adventure => adventure.id)}
                }
            });
        })
        .then(adventures => res.json(adventures));
});

app.use('/api/adventures', adventureRouter);

app.post('/api/signup', userSignUp);

app.post('/api/signin', userSignIn);

app.get('/api/hashtags', (req: Request, res: Response) => {
    const partOfHashtag = req.query.filter;

    Hashtag.findAll({where: {name: {[Op.like]: `%${partOfHashtag}%`}}}).then(
        hashtags => res.json(hashtags)
    );
});

app.post('/api/user_adventures', (req, _res) => {
    const idAdventure = req.body.idAdventure;
    const idUser = req.body.idUser;

    UserAdventure.findOne({
        where: {
            [Op.and]: {
                idUser: idUser,
                idAdventure: idAdventure
            }
        }
    }).then(obj => {
        if(obj){
            const count = obj.count + 1;
            obj.update({count})
        } else {
            const count  = 1;
            UserAdventure.create({idUser, idAdventure, count});
        }
    });
})

app.get('/', (_req, res) => res.renderPage('/adventures'));

app.get('/adventures', (_req, res) => res.renderPage('/adventures'));

app.get('/hashtag/:hashtag', (req, res) =>
    res.renderPage('/hashtag', {hashtag: req.params.hashtag})
);

app.get('/scene/:id', (req, res) =>
    res.renderPage('/scene', {id: req.params.id})
);

app.get('/signin', (_req, res) => res.renderPage('/signin'));

app.get('/signup', (_req, res) => res.renderPage('/signup'));

const error404 = (_req: Request, res: Response) => res.sendStatus(404);

app.all('/api/*', error404);

app.all('*', (req, res) => {
    const handleRequest = req.nextApp.getRequestHandler();
    const parsedUrl = parse(req.url, true);

    return handleRequest(req, res, parsedUrl);
});

app.use((err: Error, _req: Request, res: Response, _next: Next) => {
    console.error(err.stack);

    res.sendStatus(500);
});

db.authenticate()
    .then(() => console.info('database connected'))
    .catch((err: any) => {
        console.info(err);
    });

nextApp.prepare().then(() => {
    const _port = config.get('port');

    app.listen(_port, () => {
        console.info(`Server started on ${_port}`);
        console.info(`Open http://localhost:${_port}/`);
    });
});
