import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';

import {Scene} from './Scene';
import {SceneAchievement} from './SceneAchievement';

@Table({
    tableName: 'achievements'
})
export class Achievement extends Model<Achievement> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @AllowNull(false)
    @Column(DataType.TEXT)
    picture: string;

    @BelongsToMany(() => Scene, () => SceneAchievement)
    scenes: Scene[];
}
