import m from '../../../global/modules/literals/messages.js';
import { cd } from '../../../global/modules/paths.js';
import { cache, getCache } from '../../../global/modules/cache.js';
import inject from '../../../global/modules/inject.js';
import { bind } from '../../../global/modules/wrapper.js';
import { loadingAnim } from '../../../global/modules/animations.js';

// Listener for create button
async function createListener() {
    loadingAnim('#create-btn');

    _('#create-btn').disabled = true;
    _('#join-btn').disabled = true;

    console.log(`server: ${m.servers[0]}`);
    await cache(m.caches.server, m.servers[0]);

    console.log(`cached server : ${await getCache(m.caches.server)}`);

    console.log('video success');
    let obj = await inject(m.server.connect);

    console.log('obj:');
    console.log(obj);

    if (obj.data !== m.server.events.errorMessage) {
        window.location.href = cd(window.location.href, '../../create/create.html');
    }
}

async function joinListener() {
    window.location.href = cd(window.location.href, '../../join/join.html');
}

function main() {
    _('#create-btn').on('click', createListener);
    _('#join-btn').on('click', joinListener);
}


bind(false, main);
