import { bind } from '../../../global/modules/wrapper.js';
import inject from '../../../global/modules/inject.js';
import m from '../../../global/modules/literals/messages.js';
import { cache, getCache } from '../../../global/modules/cache.js';
import * as key from '../../../global/modules/key.js';


/* NOTES:

- fix server so roomkey == user id (COMPLETED)
- finish video sync fn
- add join page
- add iframe support

*/

async function main() {
    await cache(m.caches.key, key.random());
    
    let obj = JSON.parse(await inject(m.server.registerUser));

    console.log(obj);

    _('#link-label').html(`${await getCache(m.caches.key)}-${await getCache(m.caches.server)}`);
}


bind(false).then(main);