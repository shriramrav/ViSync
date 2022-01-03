import { bind } from '../../../global/modules/wrapper.js';
import { cache } from '../../../global/modules/cache.js';
import m from '../../../global/modules/literals/messages.js';


async function listener() {

    _('#join-btn').disabled = true;

    let codes = _('#input').val().split('-');

    // CAUTION: Errors not checked
    await cache(m.caches.key, codes[0]);
    await cache(m.caches.server, codes[1]);

    

    // alert(_('#input').val());

}

function main() {
    _('#join-btn').on('click', listener);
}


bind(false).then(main);