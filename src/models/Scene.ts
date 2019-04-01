import { AllowNull, BelongsTo, BelongsToMany, Column,
    DataType, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Achievement } from './Achievement';
import { Action } from './Action';
import { Adventure } from './Adventure';
import { SceneAchievement } from './SceneAchievement';

@Table({
    tableName: 'scenes'
})
export class Scene extends Model<Scene> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Adventure)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    adventureId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    picturePosition: string;

    @Column(DataType.TEXT)
    picture: string;

    @Column(DataType.TEXT)
    text: string;

    @BelongsToMany(() => Achievement, () => SceneAchievement)
    achievements: Achievement[];

    @HasMany(() => Action)
    actions: Action[];

    @BelongsTo(() => Adventure)
    adventure: Adventure;
}
