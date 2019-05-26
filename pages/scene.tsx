import {withRouter} from 'next/router';
import React, {Component, Fragment} from 'react';

import Scene from '../components/scene';
import {ISceneData} from '../src/types';

interface IScenePageProps {
    id: number;
    router: any;
    userAuth: boolean;
}

interface IScenePageState {
    scene?: ISceneData;
}

class ScenePage extends Component<IScenePageProps, IScenePageState> {
    static getInitialProps({req, query}: any) {
        const id = req ? req.params.id : query.id;

        return {id};
    }

    state: IScenePageState = {
        scene: undefined
    };

    componentDidUpdate(prevProps: any) {
        const {query} = this.props.router;

        if (query.id !== prevProps.router.query.id) {
            this.fetchScene();
        }
    }

    componentDidMount() {
        this.fetchScene();
    }

    fetchScene = () => {
        fetch(`/api/scene/${this.props.id}`)
            .then((response) => {
                return response.json();
            })
            .then((scene) => {
                this.setState({scene});
            });
    }

    render() {
        const {scene} = this.state;

        if (!scene) {
            return <p>Loading...</p>;
        }

        if (scene) {
            return (
                <Fragment>
                    <Scene key={scene.id} {...scene} />
                </Fragment>
            );
        }
    }
}

export default withRouter(ScenePage);
