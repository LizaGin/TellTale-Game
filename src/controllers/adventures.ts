import {Adventure} from '../models/Adventure';
import {Hashtag} from '../models/Hashtag';
import { User } from '../models/User';

export function adventureRouter(_req: any, res: any) {
    Adventure.findAll({
        include: [{ model: User }, { model: Hashtag }  ],
        limit: 5
    }).then(adventures => {
        res.json(adventures);
    });
}
