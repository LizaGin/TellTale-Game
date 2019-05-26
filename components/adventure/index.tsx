import Link from 'next/link';
import React from 'react';

import {IAdventureData} from '../../src/types';

export default function Adventure(adventure: IAdventureData) {
    return (
        <section className='adventure'>
            <div className='adventure-picture'>
                <Link href={`/scene?id=${adventure.firstSceneId}`}>
                        <img width='200' height='150' src={adventure.picture} />
                </Link>
             </div>
            <div className='adventure-description'>
                <Link href={`/scene?id=${adventure.firstSceneId}`}>
                    <div className='adventure-name'>
                        {adventure.name}
                    </div>
                 </Link>
                <div className='adventure-text'>
                    {adventure.text}
                </div>
                <div className='adventure-users'>
                    { adventure.users.map(user => {
                        let count;
                        if((user as any).UserAdventure.count > 1){
                        count = 
                        <div className="adventure-user-count">
                            {(user as any).UserAdventure.count}
                        </div>
                        }
                        return(
                            <div key={user.name} className='adventure-user'>
                                <img className='adventure-user-picture'
                                     src={user.picture} 
                                     title={user.name}
                                     alt={user.name}/>
                                {count}
                            </div>
                        )
                    })}
                </div>
                <div className='adventure-hashtags'>
                    {adventure.hashtags.map(hashtag => {
                        return (
                            <div key={hashtag.id} className='adventure-hashtag'>
                                <Link href={`/hashtag?hashtag=${hashtag.slug}`}>
                                    <div className='adventure-hashtag-text'>
                                        #{hashtag.name}
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
