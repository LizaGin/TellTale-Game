import Link from 'next/link';
import React from 'react';

export default function HeaderUnauthorized() {
    return (
    <header className='main-header'>
        <div className='main-title'>
            <div className='main-icon'>
                <Link>
                    <a href='/adventures'>
                        <img src='/static/icon.svg' alt='' />
                    </a>
                </Link>
            </div>
            <div className='main-headline'>
                <Link href='/adventures'>
                    <a>
                        <span>Telltail</span> Games
                    </a>
                </Link>
            </div>
        </div>
        <div className='user-menu'>
            <Link href='/signup'>
                <a>
                    <button className='link-button grey in-header'>
                            Зарегистрироваться
                    </button>
                </a>
            </Link>
            <Link href='/signin'>
                <a>
                    <button className='link-button'>Войти</button>
                </a>
            </Link>
        </div>
    </header>
    );
}
