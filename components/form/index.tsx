import React, {createRef} from 'react';

interface IFormPageState {
    selectedTags: string[];
    suggestionTags: string[];
    query: string;
}

interface IFormPageProps {
    handleSubmit(query: any, queryHashtag: string[]): void;
}

export default class Form extends React.Component<IFormPageProps, IFormPageState> {
    state: IFormPageState = {
        query: '',
        selectedTags: [],
        suggestionTags: []
    };

    hashtagRef = createRef<HTMLInputElement>();

    handleQueryChange = (evt: any) => {
        this.setState({
            query: evt.target.value
        });
    }

    handleDelete = (name: string, form: Form) => {
        return function(_event: any) {
            const tags = form.state.selectedTags;
            const index = tags.indexOf(name);
            tags.splice(index, 1);
            form.setState({selectedTags: tags});
        };
    }

    handleAddition = (event: any) => {
        const clickedTag = event.target.innerText;
        const tags = this.state.selectedTags;
        let selectedTags = [...tags];
        this.hashtagRef.current!.value = '';
        if (!tags.includes(clickedTag)) {
            selectedTags = [...tags, clickedTag];
        }

        this.setState({selectedTags});
    }

    handleSearch = () => {
        const search = this.hashtagRef.current!.value;
        const allTags: string[] = [];

        fetch(`/api/hashtags?filter=${search}`)
            .then(res => res.json())
            .then(hashtags => {
                if (search.trim() !== '') {
                    hashtags.forEach((tag: any) => allTags.push(tag.name));
                    this.setState({suggestionTags: allTags});
                    return;
                }

                this.setState({suggestionTags: []});
            });
    }

    handleKeydown = (event: any) => {
        const hashtagList = document.getElementById('hashtag-list');
        const key = event.keyCode;
        if (this.state.suggestionTags.length) {
            if (key === 40 || key === 38) {
                // Down (40), up (38)
                event.preventDefault();
                let next;
                const sel = hashtagList!.querySelector(
                    '.search-hashtag.selected'
                );
                // eslint-disable-next-line no-negated-condition
                if (!sel) {
                    next =
                        key === 40
                            ? hashtagList!.firstChild
                            : hashtagList!.lastChild;
                    (next as HTMLElement).classList.add('selected');
                } else {
                    next = key === 40 ? sel!.nextSibling : sel!.previousSibling;
                    if (next) {
                        sel.classList.remove('selected');
                        (next as HTMLElement).classList.add('selected');
                    } else {
                        sel.classList.remove('selected');
                        next = 0;
                    }
                }

                return false;
            }

            if (key === 13) {
                const sel = hashtagList!.querySelector(
                    '.search-hashtag.selected'
                );
                if (sel) {
                    (sel as HTMLElement).click();
                }
            }
        }
    }

    render() {
        const suggestionTags = this.state.suggestionTags.filter(
            tag => !this.state.selectedTags.includes(tag)
        );
        return (
            <article className='search-form' id='search-form'>
                <div className='search-line'>
                    <input
                        type='text'
                        id='search-line adventure'
                        className='search-line adventure'
                        placeholder='Текст запроса'
                        onChange={this.handleQueryChange}
                    />
                    <button
                        id='link-button'
                        className='link-button'
                        onClick={() =>
                            this.props.handleSubmit(
                                this.state.query,
                                this.state.selectedTags
                            )
                        }
                    >
                        Найти
                    </button>
                </div>
                <div className='search-line'>
                    <div id='adventure-hashtags' className='adventure-hashtags search'>
                        {this.state.selectedTags.map((tag) => (
                            <div key={tag} className="adventure-hashtag search">
                                #{tag}
                                <span className='close' onClick={this.handleDelete(tag, this)}>
                                    X
                                </span>
                            </div>
                        ))}
                </div>
                <div className='adventure-hashtags-search'>
                    <input
                            ref={this.hashtagRef}
                            autoComplete="off"
                            className="search-line-hashtag"
                            id="search-line-hashtag"
                            onInput={this.handleSearch}
                            onKeyDown={this.handleKeydown}
                            placeholder="Хэштег"
                            type="text"
                        />
                    <div
                id='hashtag-list'
                className='hashtag-list'
                style={{ display: this.hashtagRef ? 'block' : 'none' }}>
                            {suggestionTags.map(tag => (
                                    <div key={tag}
                                        className="search-hashtag"
                                        onClick={this.handleAddition}
                                        style={{display: this.hashtagRef ? 'block' : 'none'}}>
                                        {tag}
                                    </div>
                            ))}
                </div>
                </div>

                </div>
            </article>
        );
    }
}
