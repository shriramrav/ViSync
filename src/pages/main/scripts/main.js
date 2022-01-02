import messages from '../../../global-modules/literals/messages.js';
import { cd } from '../../../global-modules/paths.js';
import { cache } from '../../../global-modules/cache.js';
import inject from '../../../global-modules/inject.js';
import _ from '../../../global-modules/wrapper.js';

function startLoadingAnim() {
    const message = 'Loading...';

    _('#create-btn').html(`<b>${(() => {
        let wrapped = '';
        for (let i = 0; i < message.length; i++) {
            wrapped += `<span>${message.charAt(i)}</span>`;
        }
        return wrapped;
    })()}</b>`);

    _('#create-btn').addClasses(['anim']);
}


async function createRoomListener() {
    startLoadingAnim();

    _('#create-btn').disabled = true;
    _('#join-btn').disabled = true;

    let videoResult = (await inject(messages.video)).result;

    // Condition used to avoid unnecessary server connection
    let serverResult = videoResult ? (await inject(messages.server)) : null;

    console.log(videoResult);
    console.log(serverResult);

    if (videoResult) {
        await cache('server', serverResult);
        window.location.href = cd(window.location.href, '../../create/create.html');
    }
}



_('#create-btn').on('click', createRoomListener);