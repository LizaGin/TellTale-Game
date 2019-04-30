/* eslint-disable array-callback-return */
const query = {
    limit: 5,
    offset: 0,
    adventure: '',
    hashtag: '',
    hashtags: []
};

let isFetching = false;

const hashtagSearchLine = document.getElementById('search-line-hashtag');
const adventureSearchLine = document.getElementById('search-line-adventure');
const hashtagList = document.getElementById('hashtag-list');
const searchButton = document.getElementById('search-button');

hashtagSearchLine.addEventListener('input', giveHashtags);
hashtagSearchLine.addEventListener('keydown', keydownHandler);
searchButton.addEventListener('click', renderAdventures);
window.addEventListener('scroll', updateAdventures);
window.addEventListener('load', updateAdventures);

function giveHashtags() {
    query.hashtag = hashtagSearchLine.value;

    destroyListOfHashtags();

    let listOfHashtags = [];

    fetch(`/api/hashtags?filter=${query.hashtag}`)
        .then(res => res.json())
        .then(hashtags => {
            if (query.hashtag !== '') {
                hashtags.forEach(tag => listOfHashtags.push(tag.name));
                listOfHashtags = listOfHashtags.filter(tag => !query.hashtags.includes(tag));
                renderListOfHashtags(listOfHashtags);
            }
        });
}

function renderListOfHashtags(listOfHashtags) {
    for (let i = 0; i < listOfHashtags.length; i++) {
        const hashtag = createElement('div', {class: 'search-hashtag'});
        hashtag.innerHTML = listOfHashtags[i].replace(query.hashtag, `<b>${query.hashtag}</b>`);

        document.getElementById('hashtag-list').appendChild(hashtag);
        hashtag.addEventListener('click', createRenderHashtag(hashtag));
    }
}

function destroyListOfHashtags() {
    const hashtagList = document.getElementById('hashtag-list');

    while (hashtagList.firstChild) {
        hashtagList.removeChild(hashtagList.firstChild);
    }
}

function createRenderHashtag(element) {
    return function (_event) {
        const name = element.innerHTML.split(/<b>|<[/]b>/).join('');

        const close = createElement('span', {class: 'close'});
        close.innerHTML = '  X';

        const hashtag = createElement('div', {class: 'adventure-hashtag search'});
        hashtag.innerHTML = `#${name}`;
        hashtag.appendChild(close);

        if (!query.hashtags.includes(name)) {
            query.hashtags.push(name);
            document.getElementById('adventure-hashtags').appendChild(hashtag);
            destroyListOfHashtags();
            hashtagSearchLine.value = '';
        }

        close.onclick = (function (hashtag, name) {
            return function () {
                const index = query.hashtags.indexOf(name);
                query.hashtags.splice(index, 1);
                hashtag.parentNode.removeChild(hashtag);
            };
        })(hashtag, name);
    };
}

function keydownHandler(event) {
    const key = event.keyCode;
    if (key === 40 || key === 38) { // Down (40), up (38)
        event.preventDefault();
        let next;
        let sel = hashtagList.querySelector('.search-hashtag.selected');
        // eslint-disable-next-line no-negated-condition
        if (!sel) {
            next = (key === 40) ? hashtagList.firstChild : hashtagList.lastChild;
            next.classList.add('selected');
        } else {
            next = (key === 40) ? sel.nextSibling : sel.previousSibling;
            if (next) {
                sel.classList.remove('selected');
                next.classList.add('selected');
            } else {
                sel.classList.remove('selected');
                next = 0;
            }
        }

        return false;
    }

    if (key === 13) {
        let sel = hashtagList.querySelector('.search-hashtag.selected');
        if (sel) {
            sel.click();
        }
    }
}

function elemInView(elem) {
    const rect = elem.getBoundingClientRect();
    return ((rect.top >= 0) && (rect.bottom <= window.innerHeight));
}

function updateAdventures() {
    const lastAdventure = document.querySelector('.adventure:last-child');
    const lastAdventureName = lastAdventure.querySelector('.adventure-name');
    const isLastAdventureVisible = !lastAdventure || elemInView(lastAdventureName);

    if (isLastAdventureVisible) {
        query.offset = document.querySelectorAll('.adventure').length;

        giveAdventures();
    }
}

function renderAdventures() {
    query.offset = 0;
    query.adventure = adventureSearchLine.value;

    const parent = document.getElementById('adventures');
    parent.innerHTML = '';
    giveAdventures();
}

function giveAdventures() {
    if (isFetching) {
        return;
    }

    const listOfAdventures = [];
    isFetching = true;

    fetch(`/api/adventures?offset=${query.offset}&limit=${query.limit}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            adventure: query.adventure,
            hashtags: query.hashtags
        })
    })
        .then(res => res.json())
        .then(adventures => {
            isFetching = false;
            adventures.map(el => listOfAdventures.push(el));
            createAdventures(listOfAdventures);
        });
}

function createAdventures(adventures) {
    const parent = document.getElementById('adventures');

    for (const adventure of adventures) {
        const adventureElement = createElement('section', {class: 'adventure'});

        addPicture(adventure, adventureElement);
        addDesription(adventure, adventureElement);
        parent.appendChild(adventureElement);
    }
}

function addPicture(adventure, node) {
    const wrapper = createElement('div', {class: 'adventure-picture'});

    const path = createElement('a', {href: `/scene/${adventure.firstSceneId}`});

    const pictureAttr = {
        src: adventure.picture,
        width: 200,
        height: 150
    };
    const picture = createElement('img', pictureAttr);

    path.appendChild(picture);
    wrapper.appendChild(path);
    node.appendChild(wrapper);
}

function addDesription(adventure, node) {
    const description = createElement('div', {class: 'adventure-description'});

    const nameAttr = {
        class: 'adventure-name',
        href: `/scene/${adventure.firstSceneId}`
    };
    const name = createElement('a', nameAttr);
    name.innerHTML = adventure.name;

    const text = createElement('div', {class: 'adventure-text'});
    text.innerHTML = adventure.text;

    const hashtags = createElement('div', {class: 'adventure-hashtags'});

    if (adventure.hashtags) {
        for (const el of adventure.hashtags) {
            const hashtag = createElement('div', {class: 'adventure-hashtag'});

            const pathAttr = {
                class: 'adventure-hashtag-link',
                href: `/hashtag/${el.slug}`
            };
            const path = createElement('a', pathAttr);
            path.innerHTML = `#${el.name}`;

            hashtag.appendChild(path);
            hashtags.appendChild(hashtag);
        }
    }

    appendChilds(description, [name, text, hashtags]);
    node.appendChild(description);
}

function createElement(tag, attributes) {
    const element = document.createElement(tag);

    Object.entries(attributes).map(([attr, value]) => {
        element.setAttribute(attr, value);
    });

    return element;
}

function appendChilds(parent, childs) {
    childs.forEach(child => parent.appendChild(child));
}
