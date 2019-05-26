import config from 'config';
import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Default,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {Adventure} from './Adventure';
import {UserAdventure} from './UserAdventure';

const picture = config.get('defaultPicture');

@Table({
    tableName: 'users'
})
export class User extends Model<User> {
    @AllowNull(false)
    @PrimaryKey
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    password: string;

    @Default(picture)
    @AllowNull(true)
    @Column(DataType.TEXT('long'))
    picture: string;

    @BelongsToMany(() => Adventure, () => UserAdventure)
    adventures: Adventure[];
}
