import {Sequelize} from 'sequelize-typescript';

import config from 'config';

const db = new Sequelize(config.get('dbUrl'));

db.addModels([__dirname + '/models']);

export = db;
