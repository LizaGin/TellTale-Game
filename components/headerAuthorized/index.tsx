import Link from 'next/link';
import React from 'react';

interface IHeaderProps {
    userName: string;
    userPicture: string;
}

export default class HeaderAuthorized extends React.Component {
    props: IHeaderProps = {
        userName: '',
        userPicture: ''
    };

    handleSubmit = () => {
        localStorage.removeItem('userAuth');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPicture');
    }

    render() {
        return (
            <header className='main-header'>
                <div className='main-title'>
                    <div
                        className='main-icon'
                        >
                        <Link href='/adventures'>
                            <a>
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
                    <img
                        width='50'
                        height='50'
                        className='user-avatar'
                        src={this.props.userPicture}
                    />
                    <div className='username'>{this.props.userName}</div>
                    <Link href='/'>
                            <button
                                className='link-button grey'
                                onClick={this.handleSubmit}
                            >
                                Выйти
                            </button>
                    </Link>
                </div>
            </header>
        );
    }
}
