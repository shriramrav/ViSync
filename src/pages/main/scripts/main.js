import m from '../../../global/modules/literals/messages.js';
import { cd } from '../../../global/modules/paths.js';
// import { cache } from '../../../global/modules/cache.js';
import inject from '../../../global/modules/inject.js';
import { bind } from '../../../global/modules/wrapper.js';

function startAnim() {
    const message = 'Loading...';

    _('#create-btn').html(`<b>${message
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('')
    }</b>`);

    _('#create-btn').addClasses(['anim']);
}

// Listener for create button
async function createListener() {
    startAnim();

    _('#create-btn').disabled = true;
    _('#join-btn').disabled = true;

    if ((await inject(m.video)).result) {
        await cache(m.caches.server, m.servers[0]);
        if ((await inject(m.server.connect)).data !== m.server.connect.errorMessage) {
            window.location.href = cd(window.location.href, '../../create/create.html');
        }
    }
}

async function joinListener() {
    window.location.href = cd(window.location.href, '../../join/join.html');
}

function main() {
    _('#create-btn').on('click', createListener);
    _('#join-btn').on('click', joinListener);
}


bind(false).then(main);
