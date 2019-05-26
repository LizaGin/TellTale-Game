import {
    AllowNull,
    BelongsToMany,
    Column,
    DataType,
    Model,
    PrimaryKey,
    Table
} from 'sequelize-typescript';
import {Adventure} from './Adventure';
import {AdventureHashtag} from './AdventureHashtag';

@Table({
    tableName: 'hashtags'
})
export class Hashtag extends Model<Hashtag> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    slug: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    name: string;

    @BelongsToMany(() => Adventure, () => AdventureHashtag)
    adventures: Adventure[];
}
