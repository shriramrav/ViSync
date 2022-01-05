import { bind } from '../../../global/modules/wrapper.js';
import inject from '../../../global/modules/inject.js';
import m from '../../../global/modules/literals/messages.js';
import { cache, getCache } from '../../../global/modules/cache.js';
import * as key from '../../../global/modules/key.js';


async function destroy() {
    await inject(m.server.destroy);
    window.close();
}

async function main() {

    let _key = key.random();

    await cache(m.caches.key, _key);
    await cache(m.caches.id, _key);

    await inject(m.server.registerUser);
    await inject(m.server.init);

    _('#link-label').html(`${await getCache(m.caches.key)}`);
    _('button').on('click', destroy);
}


bind(false, main);
