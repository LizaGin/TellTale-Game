import React, {Component, Fragment} from 'react';
import {withRouter} from 'next/router';

import Adventure from '../components/adventure';
import {IAdventureData} from '../src/types';

interface IHashtagPageProps {
    hashtag: string;
    router: any;
}

interface IHashtagPageState {
    adventures: IAdventureData[];
    loading: boolean;
}

class HashtagPage extends Component<IHashtagPageProps, IHashtagPageState> {
    static getInitialProps({req, query}: any) {
        const hashtag = req ? req.params.hashtag : query.hashtag;

        return {hashtag};
    }

    state: IHashtagPageState = {
        adventures: [],
        loading: true
    };

    componentDidMount() {
        this.fetchAdventures();
    }

    componentDidUpdate(prevProps: any) {
        const {query} = this.props.router;

        if (query.hashtag !== prevProps.router.query.hashtag) {
            this.fetchAdventures();
        }
    }

    fetchAdventures = () => {
        fetch(`/api/hashtag/${this.props.hashtag}`)
            .then((response) => response.json())
            .then((data) => {
                const adventures = data.adventures;
                this.setState({adventures, loading: false});
            });
    }

    render() {
        const {adventures, loading} = this.state;

        if (loading) {
            return <p>Loading...</p>;
        }

        if (!adventures.length) {
            return <p>Adventure not found!</p>;
        }

        return (
            <Fragment>
                <main className='general-layout'>
                    <div className='main-text'>#{this.props.hashtag}</div>
                    <article id='adventures' className='adventures-container'>
                        {adventures.map((adventure) => (
                            <Adventure key={adventure.id} {...adventure} />
                        ))}
                    </article>
                </main>
            </Fragment>
        );
    }
}

export default withRouter(HashtagPage);
