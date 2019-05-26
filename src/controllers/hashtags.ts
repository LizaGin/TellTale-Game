import {Op} from 'sequelize';
import {Adventure} from '../models/Adventure';
import {Hashtag} from '../models/Hashtag';
import { User } from '../models/User';

export function hashtagRouter(req: any, res: any) {
    const hashtagName = req.params.hashtag;

    Hashtag.findOne({
        include: [{model: Adventure, include: [{model: Hashtag}, {model: User}]}],
        where: {slug: {[Op.eq]: hashtagName}}
    }).then(hashtag => {
        const data = {
            adventures: hashtag ? hashtag.adventures : [],
            hashtagName
        };
        res.json(data);
    });
}
