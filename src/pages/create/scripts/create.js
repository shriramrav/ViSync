import { bind } from '../../../global/modules/wrapper.js';
import inject from '../../../global/modules/inject.js';
import m from '../../../global/modules/literals/messages.js';
import { cache, getCache } from '../../../global/modules/cache.js';
import * as key from '../../../global/modules/key.js';


async function listener() {
    console.log('listener ran');

    // await inject(m.server.destroy);

    console.log('now will close');
    window.close();
}

async function main() {

    let _key = key.random();

    await cache(m.caches.key, _key);
    await cache(m.caches.id, _key);

    console.log('before');
    let obj = JSON.parse(await inject(m.server.registerUser));
    
    console.log(obj);

    // await inject(m.server.init);

    console.log(obj);

    _('#link-label').html(`${await getCache(m.caches.key)}`);
    _('#btn').on('click', listener);
}


bind(false, main);
