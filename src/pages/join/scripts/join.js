import { bind } from '../../../global/modules/wrapper.js';
import { cache } from '../../../global/modules/cache.js';
import m from '../../../global/modules/literals/messages.js';
import inject from '../../../global/modules/inject.js';


function rejectErrors(roomCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let codes = roomCode.split('-'); 
            let msc = m.server.connect;

            await cache(m.caches.key, codes[0]);
            await cache(m.caches.server, codes[1]);
            
            if (await inject(msc) === msc.errorMessage) {
                throw '';
            }

            resolve();

        } catch (err) {
            reject();
        }
    });
}


function listener() {
    _('#join-btn').disabled = true;

    rejectErrors(_('#input').val()).then(async () => {
        console.log('connection successful');
        await inject(m.server.registerUser);
        await inject(m.server.init);

    }).catch(() => {
        console.log('error caught');
    });

}

function main() {
    _('#join-btn').on('click', listener);
}


bind(false).then(main);