import config from 'config';
import express from 'express';
import { Op } from 'sequelize';
import { Adventure } from '../models/Adventure';
import { Hashtag } from '../models/Hashtag';

const hashtagRouter = express.Router();

const staticBasePath = config.get('staticBasePath');

hashtagRouter.get('/:hashtag', (req, res) => {
        const hashtagName = req.params.hashtag;

        Hashtag.findOne({
            include: [{ model: Adventure, include: [{model: Hashtag}] }],
            where: {slug: {[Op.eq]: hashtagName}}
          })
        .then((hashtag) => {
            const data = { adventures: hashtag ? hashtag.adventures : [], staticBasePath, hashtagName};
            res.render('hashtags', data );
        });
    }
);

export = hashtagRouter;
