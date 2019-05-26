import Router from 'next/router';
import React, {Component, Fragment} from 'react';

import SignUp from '../components/signUp';
import Warning from '../components/warning';

interface ISignUpPageState {
    name: string;
    password: string;
    picture: string;
    isCorrectData: boolean;
}

interface ISignUpPageProps {
    updateState(userAuth: boolean, userName: string, userPicture: string): void;
    userAuth: boolean;
}

export default class IndexPage extends Component<ISignUpPageProps, ISignUpPageState> {
    state: ISignUpPageState = {
        isCorrectData: true,
        name: '',
        password: '',
        picture: ''
    };

    handleSubmit = (name: string, password: string, picture: string) => {
        if (name && password) {
            fetch('/api/signup', {
                body: JSON.stringify({
                    name,
                    password,
                    picture
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
                        this.props.updateState(
                            true,
                            data.name,
                            data.userPicture
                        );
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
        let text = 'Такой пользователь уже существует';
        if(!this.state.isCorrectData){
            warning = <Warning text={ text }/>;
        }

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
                <p className='main-text'>Регистрация</p>
                <SignUp handleSubmit={this.handleSubmit} />
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
