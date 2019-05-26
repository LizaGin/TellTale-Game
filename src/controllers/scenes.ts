import {Achievement} from '../models/Achievement';
import {Action} from '../models/Action';
import {Adventure} from '../models/Adventure';
import {Scene} from '../models/Scene';

export function sceneRouter(req: any, res: any) {
    const {id} = req.params;

    Scene.findOne({
        include: [{model: Action}, {model: Achievement}, {model: Adventure}],
        where: {id}
    }).then(scene => {
        res.json(scene);
    });
}
