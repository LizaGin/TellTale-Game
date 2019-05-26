import {
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';

import {Adventure} from './Adventure';
import {User} from './User';

@Table({
    tableName: 'users_adventures'
})
export class UserAdventure extends Model<UserAdventure> {
    @AllowNull(false)
    @ForeignKey(() => User)
    @Column(DataType.STRING)
    idUser: string;

    @AllowNull(false)
    @ForeignKey(() => Adventure)
    @Column(DataType.INTEGER)
    idAdventure: number;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    count: number;
}
