import Router from 'next/router';
import React, {Component, Fragment} from 'react';

import SignIn from '../components/signIn';
import Warning from '../components/warning';

interface ISignInPageState {
    name: string;
    password: string;
    isCorrectData: boolean;
}

interface ISignInPageProps {
    updateState(userAuth: boolean, userName: string, userPicture: string): void;
    userAuth: boolean;
}

export default class IndexPage extends Component<ISignInPageProps, ISignInPageState> {
    state: ISignInPageState = {
        isCorrectData: true,
        name: '',
        password: ''
    };

    handleSubmit = (name: string, password: string) => {
        if(name && password){
            fetch('/api/signin', {
                body: JSON.stringify({
                    name,
                    password
                }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            })
                .then((response) => {
                    if(response.status === 400){
                        this.setState({isCorrectData: false});
                    }
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then((data) => {
                    if (data) {
                        this.props.updateState(true, data.name, data.userPicture);
                        localStorage.setItem('userAuth', 'true');
                        localStorage.setItem('userName', data.name);
                        localStorage.setItem('userPicture', data.userPicture);
                        Router.push('/adventures');
                    }
                });
        }
    }

    componentDidUpdate(){
        if(!this.state.isCorrectData){
            this.render();
        }
    }

    render() {
        let warning;
        let page;
        let text = 'Данные некорректны: проверьте логин или пароль';
        if(!this.state.isCorrectData){
            warning = <Warning text={ text }/>;
        };

        if(this.props.userAuth){
            page =             
            <Fragment>
                <main className='general-layout'>
                    <Warning text={'Вы уже аутентифицированны'}/>
                </main>
            </Fragment>
        } else {
            page =                 
            <main className='general-layout'>
                <p className='main-text'>Вход</p>
                <SignIn handleSubmit={this.handleSubmit} />
                {warning}
            </main>
        }

        return (
            <Fragment>
               {page}
            </Fragment>
        );
    }
}
