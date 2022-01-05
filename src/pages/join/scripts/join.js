import { bind } from '../../../global/modules/wrapper.js';
import { cache } from '../../../global/modules/cache.js';
import m from '../../../global/modules/literals/messages.js';
import inject from '../../../global/modules/inject.js';
import * as key from '../../../global/modules/key.js';


/* NOTES::
 - Add seperate error message for registerUser
 - Finish up init
 - Fix infinite loop glitch on video player
 - Add error animation for join
 - Finish disconnect buttons
*/


function rejectErrors(code) {
    return new Promise(async (resolve, reject) => {
        try {
            let msc = m.server.connect;

            await cache(m.caches.key, code);
            await cache(m.caches.id, key.random());
            
            // Only one server enabled, can change later
            await cache(m.caches.server, m.servers[0]);
            
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
    _('button').disabled = true;

    // REMOVE LATER
    _('#input').disabled = true;

    rejectErrors(_('#input').val()).then(async () => {
        console.log('connection successful');
        let regResult = JSON.parse(await inject(m.server.registerUser));
        
        if (regResult.data === m.server.connect.errorMessage) {
            return Promise.reject();
        }

        // await inject(m.server.init);
        // set Disconnect button
    })
    .catch(() => {
        console.log('error caught');

        // Run error animation here
    });

}

function main() {
    _('button').on('click', listener);
}


bind(false).then(main);