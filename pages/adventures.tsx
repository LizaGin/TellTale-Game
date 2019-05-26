import React, {Component, Fragment} from 'react';

import Adventure from '../components/adventure';
import Form from '../components/form';

import {IAdventureData} from '../src/types';

interface IAdventuresPageProps {
    adventures: IAdventureData[];
}

interface IAdventuresPageState {
    adventures: IAdventureData[];
    isLastAdventure: boolean;
    limit: number;
    offset: number;
    query: string;
    queryHashtags: string[];
}

export default class IndexPage extends Component<IAdventuresPageProps, IAdventuresPageState> {
    state: IAdventuresPageState = {
        adventures: [],
        isLastAdventure: false,
        limit: 5,
        offset: 0,
        query: '',
        queryHashtags: []
    };

    elemInView = (elem: any) => {
        const rect = elem.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= window.innerHeight;
    }

    componentDidMount() {
        this.giveAdventures();
        window.addEventListener('scroll', this.updateAdventures);
        window.addEventListener('load', this.updateAdventures);
    }

    componentWillunmount() {
        window.removeEventListener('scroll', this.updateAdventures);
        window.removeEventListener('load', this.updateAdventures);
    }

    giveAdventures = () => {
        let updatedAdventures = this.state.adventures;

        if (!this.state.isLastAdventure) {
            fetch(
                `/api/adventures?offset=${this.state.offset}&limit=${
                    this.state.limit
                }`,
                {
                    body: JSON.stringify({
                        adventure: this.state.query,
                        hashtags: this.state.queryHashtags
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'POST'
                }
            )
                .then(res => res.json())
                .then(adventures => {

                    updatedAdventures = updatedAdventures.concat(adventures);

                    this.setState(() => ({
                        adventures: updatedAdventures,
                    }));
                    if (!adventures.length) {
                        this.setState(() => ({isLastAdventure: true}));
                    }
                });
        }
    }

    updateAdventures = () => {
        const lastAdventure = document.querySelector('.adventure:last-child');
        if (lastAdventure) {
            const lastAdventureName = lastAdventure!.querySelector(
                '.adventure-name'
            );
            const isLastAdventureVisible =
                !lastAdventure || this.elemInView(lastAdventureName);

            if (isLastAdventureVisible) {
                const offset = this.state.adventures.length;
                this.setState({offset}, this.giveAdventures);
            }
        }
    }

    handleSubmit = (query: string, queryHashtags: string[]) => {
        this.setState(
            {
                adventures: [],
                isLastAdventure: false,
                offset: 0,
                query,
                queryHashtags
            },
            () => this.giveAdventures(),
        );
    }

    render() {

        const {adventures, isLastAdventure} = this.state;

        if (!adventures.length) {
            return (
                <Fragment>
                    <Form handleSubmit={this.handleSubmit} />
                    <main className='general-layout'>
                        <article
                            id='adventures'
                            className='adventures-container'
                        >
                            <p>Loading...</p>
                        </article>
                    </main>
                </Fragment>
            );
        }

        if (isLastAdventure && !adventures.length) {
            return (
                <Fragment>
                    <Form handleSubmit={this.handleSubmit} />
                    <main className='general-layout'>
                        <article
                            id='adventures'
                            className='adventures-container'
                        >
                            <p>
                                Adventures not found...
                            </p>
                        </article>
                    </main>
                </Fragment>
            );
        }

        return (
            <Fragment>
                <Form handleSubmit={this.handleSubmit} />
                    <main className='general-layout'>
                        <article id='adventures' className='adventures-container'>
                            {adventures.map(adventure => (
                                <Adventure key={adventure.id} {...adventure} />
                            ))}
                        </article>
                    </main>
                </Fragment>
        );
    }
}
