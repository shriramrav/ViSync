import { bind } from '../../../global/modules/wrapper.js';
import { cache } from '../../../global/modules/cache.js';
import m from '../../../global/modules/literals/messages.js';
import inject from '../../../global/modules/inject.js';
import * as key from '../../../global/modules/key.js';
import { loadingAnim } from '../../../global/modules/animations.js';

/* NOTES::
 - Finish up init
 - Fix infinite loop glitch on video player
 - Add maintain state feature
*/


async function destroy() {
    await inject(m.server.destroy);
    window.close();
}


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
    loadingAnim('button');

    rejectErrors(_('#input').val()).then(async () => {
        let regResult = JSON.parse(await inject(m.server.registerUser));
        
        if (regResult.data === m.server.events.errorMessage) {
            return Promise.reject();
        }

        await inject(m.server.init);

        // Set up disconnect
        _('button').removeClasses(['loading-anim']);
        _('button').html('<b>Disconnect<b>');
        _('button').addClasses(['disconnect']);
        _('button').off('click', listener);
        _('button').on('click', destroy);
    })
    .catch(() => {
        console.log('error caught');

        // Run error animation
        _('button').removeClasses(['loading-anim']);
        _('button').addClasses(['error']);
        _('button').html('<b>Error<b>');

        const delay = 500;

        // Delay ensures user can see error message
        setTimeout(() => {
            _('button').removeClasses(['error']);
            _('button').html(`<b>Join<b>`);
            _('button').disabled = false;
            _('#input').disabled = false;
        }, delay);
    });

}

function main() {
    _('button').on('click', listener);
}


bind(false, main);
