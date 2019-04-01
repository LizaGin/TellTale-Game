import { AllowNull, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Scene } from './Scene';

@Table({
    tableName: 'actions'
})
export class Action extends Model<Action> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Scene)
    @Column(DataType.INTEGER)
    sceneId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;
}
