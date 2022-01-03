import { bind } from '../../../global/modules/wrapper.js';
import inject from '../../../global/modules/inject.js';
import m from '../../../global/modules/literals/messages.js';
import { cache, getCache } from '../../../global/modules/cache.js';


/* NOTES:

- fix server so roomkey == user id (COMPLETED)
- finish video sync fn
- add join page
- add iframe support

*/

async function main() {
    let obj = JSON.parse(await inject(m.server.create));
    
    await cache(m.caches.key, obj.key);
    await inject(m.server.init);

    // console.log(await getCache(m.cache.key));

    _('#link-label').html(await getCache(m.caches.key));
}


bind(false).then(main);