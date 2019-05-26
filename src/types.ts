import {Achievement} from './models/Achievement';
import {Action} from './models/Action';
import {Adventure} from './models/Adventure';
import {Hashtag} from './models/Hashtag';
import {User} from './models/User';

export interface IAdventureData {
    id: number;
    firstSceneId: number;
    picture: string;
    name: string;
    text: string;
    hashtags: Hashtag[];
    users: User[];
}

export interface ISceneData {
    id: number;
    picture: string;
    picturePosition: string;
    text: string;
    achievements: Achievement[];
    actions: Action[];
    adventure: Adventure;
}
