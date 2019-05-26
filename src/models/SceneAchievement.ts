import {
    AllowNull,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table
} from 'sequelize-typescript';

import {Achievement} from './Achievement';
import {Scene} from './Scene';

@Table({
    tableName: 'scenes_achievements'
})
export class SceneAchievement extends Model<SceneAchievement> {
    @AllowNull(false)
    @ForeignKey(() => Achievement)
    @Column(DataType.INTEGER)
    idAchievement: number;

    @AllowNull(false)
    @ForeignKey(() => Scene)
    @Column(DataType.INTEGER)
    idScene: number;
}
