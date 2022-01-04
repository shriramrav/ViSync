import { bind } from '../../../global/modules/wrapper.js';
import { cache } from '../../../global/modules/cache.js';
import m from '../../../global/modules/literals/messages.js';
import inject from '../../../global/modules/inject.js';


function rejectErrors(roomCode) {
    return new Promise((resolve, reject) => {
        try {
            let codes = roomCode.split('-'); 
            let msc = m.server.connect;
            
            await cache(m.caches.key, codes[0]);
            await cache(m.caches.server, codes[1]);
            
            (await inject(msc)).data === msc.errorMessage ? reject() : resolve();
        } catch (err) {
            reject();
        }
    });
}


async function listener() {
    _('#join-btn').disabled = true;

    rejectErrors(_('#input').val()).then(() => {
        console.log('connection successful');

    }).catch(() => {

    });


}

function main() {
    _('#join-btn').on('click', listener);
}


bind(false).then(main);