import App, {Container, NextAppContext} from 'next/app';
import Head from 'next/head'
import React from 'react';

import HeaderAuthorized from '../components/headerAuthorized';
import HeaderUnauthorized from '../components/headerUnauthorized';
import './app.css';

interface IMyAppState {
    userAuth: boolean;
    userName: string;
    userPicture: string;
    loading: boolean
}

export default class MyApp extends App {
    static async getInitialProps({Component, ctx}: NextAppContext) {
        let pageProps = {};

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }

        return {pageProps};
    }

    state: IMyAppState = {
        userAuth: false,
        userName: '',
        userPicture: '',
        loading: true
    };

    componentDidMount() {
        const userAuth = localStorage.getItem('userAuth');
        const userName = localStorage.getItem('userName');
        const userPicture = localStorage.getItem('userPicture');
        this.setState({userAuth, userName, userPicture}, () => this.setState({loading: false}));
    }

    updateState = (userAuth: string, userName: string, userPicture: string) => {
        this.setState({userAuth, userPicture, userName});
    };

    render() {
        const {Component, pageProps} = this.props;
        const loading = this.state.loading;

        let header;
        if (!this.state.userAuth) {
            header = <HeaderUnauthorized />;
        } else {
            header = (
	            <HeaderAuthorized
                    userName={this.state.userName}
                    userPicture={this.state.userPicture}
                />
            );
        }
        
        if(loading){
            return(<p>loading...</p>)
        }

        return (
            <Container>
                <Head>
                    <title>Telltail Games</title>
                </Head>
                {header}
                <Component updateState={this.updateState} userAuth={this.state.userAuth} {...pageProps} />
            </Container>
        );
    }
}
