import m from '../../../global/modules/literals/messages.js';
import { cd } from '../../../global/modules/paths.js';
import { cache } from '../../../global/modules/cache.js';
import inject from '../../../global/modules/inject.js';
import {bind} from '../../../global/modules/wrapper.js';

function startAnim() {
    const message = 'Loading...';

    _('#create-btn').html(`<b>${message
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('')
    }</b>`);

    _('#create-btn').addClasses(['anim']);
}


async function create() {
    startAnim();

    _('#create-btn').disabled = true;
    _('#join-btn').disabled = true;

    let videoResult = (await inject(m.video)).result;
    let serverData = videoResult ? JSON.parse(await inject(m.server.connect)).data : null; // Condition used to avoid server connection

    console.log(serverData);
    
    if (videoResult) {
        await cache(m.caches.id, serverData.id);
        await cache(m.caches.server, serverData.server);

        window.location.href = cd(window.location.href, '../../create/create.html');
    }
}

async function join() {

    window.location.href = cd(window.location.href, '../../join/join.html');
    
}



function main() {
    _('#create-btn').on('click', create);
    _('#join-btn').on('click', join);
}


bind(false).then(main);
