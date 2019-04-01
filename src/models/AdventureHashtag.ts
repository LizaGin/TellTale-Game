import { AllowNull, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { Adventure } from './Adventure';
import { Hashtag } from './Hashtag';

@Table({
    tableName: 'adventuresHashtags'
})
export class AdventureHashtag extends Model<AdventureHashtag> {
    @AllowNull(false)
    @ForeignKey(() => Adventure)
    @Column(DataType.INTEGER)
    adventureId: number;

    @AllowNull(false)
    @ForeignKey(() => Hashtag)
    @Column(DataType.INTEGER)
    hashtagId: number;
}
