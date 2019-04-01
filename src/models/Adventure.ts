import { AllowNull, BelongsTo,
         BelongsToMany, Column, DataType, Default, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';

import config from 'config';
import { AdventureHashtag } from './AdventureHashtag';
import { Hashtag } from './Hashtag';
import { Scene } from './Scene';

const picture = config.get('defaultPicture');

@Table({
    tableName: 'adventures'
})
export class Adventure extends Model<Adventure> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @ForeignKey(() => Scene)
    @Column(DataType.INTEGER)
    firstSceneId: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @Default(picture)
    @Column(DataType.TEXT)
    picture: string;

    @Column(DataType.TEXT)
    text: string;

    @BelongsToMany(() => Hashtag, () => AdventureHashtag)
    hashtags: Hashtag[];

    @BelongsTo(() => Scene)
    firstScene!: Scene;
}
