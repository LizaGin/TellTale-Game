import config from 'config';
import express from 'express';
import { Achievement } from '../models/Achievement';
import { Action } from '../models/Action';
import { Adventure } from '../models/Adventure';
import { Scene } from '../models/Scene';

const sceneRouter = express.Router();

const staticBasePath = config.get('staticBasePath');

sceneRouter.get('/:id', (req, res) => {
    const id = req.params.id;

    Scene.findOne({
        include: [
            {model: Action},
            {model: Achievement},
            {model: Adventure}
        ],
        where: { id }
    })
        .then((scene) => {
            const data = {staticBasePath, scene};
            res.render('scenes', data);
        });
    }
);

export = sceneRouter;
