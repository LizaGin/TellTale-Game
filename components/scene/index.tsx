import Link from 'next/link';
import React from 'react';

import {ISceneData} from '../../src/types';

export default function Scene(scene: ISceneData) {
    let actions;
    const idUser = localStorage.getItem('userName');
    const idAdventure = scene.adventure.id;

    if (!scene.actions.length && idUser) {
            fetch(`/api/user_adventures`,
            {
                body: JSON.stringify( {idUser, idAdventure} ),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST'                               
            });
    }

    if (scene.actions.length) {
        actions = scene.actions.map((action) => (
        <div className='scene-action'>
            <Link href={`/scene?id=${action.id}`}>
                <a className='scene-action-text'>{action.name}</a>
            </Link>
        </div>
        ));
    } else {
        actions = [
            <div className='scene-action'>
                <Link href={`/scene?id=${scene.adventure.firstSceneId}`}>
                    <a className='scene-action-text'>Начать заново?</a>
                </Link>
            </div>,
            <div className='scene-action'>
                <Link href='/'>
                    <a className='scene-action-text'>На главную</a>
                </Link>
            </div>
        ];
    }

    function getClass(props: any) {
        switch (props) {
            case 'BL':
                return 'scene-text bl';
            case 'BR':
                return 'scene-text br';
            case 'TL':
                return 'scene-text tl';
            case 'TR':
                return 'scene-text tr';
        }
    }

    return (
        <main className='general-layout'>
            <article className='scene'>
                <section className='scene-container'>
                    <div className='scene-position'>
                        <img
                            width='950'
                            height='380'
                            className='scene-picture'
                            src={scene.picture}
                        />
                        <div className={getClass(scene.picturePosition)}>
                            {scene.text}
                        </div>
                    </div>
                </section>
                <section className='scene-achievements'>
                    {scene.achievements.map((achieve) => (
                    <div className='scene-achievement'>
                            <img
                                className='scene-achievement-picture'
                                width='150'
                                height='150'
                                src='{{picture}}'
                            />
                        <div className='scene-achievement-name'>
                                Достижение получено
                                <div>{achieve.name}</div>
                        </div>
                    </div>
                    ))}
                </section>
                <section className='scene-actions'>{actions}</section>
            </article>
        </main>
    );
}
