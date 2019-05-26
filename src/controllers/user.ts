import {User} from '../models/User';
import config from 'config';

export function userSignUp(req: any, res: any) {
    const name = req.body.name;
    const password = req.body.password;
    const picture = req.body.picture;

    User.findOne({
        where: {name}
    }).then(user => {
        if (!user) {
            const userPicture = picture ? picture : config.get('defaultPicture');
            User.create({name, password, picture: userPicture}).then(() =>
                res.json({name, userPicture})
            );
        } else {
            res.sendStatus(400);
        }
    });
}

export function userSignIn(req: any, res: any) {
    const name = req.body.name;
    const password = req.body.password;

    User.findOne({
        where: {name}
    }).then(user => {
        if (user && user.password === password) {
            res.json({name, userPicture: user.picture});
        } else {
            res.sendStatus(400);
        }
    });
}
