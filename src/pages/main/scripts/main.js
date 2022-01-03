import messages from '../../../global/modules/literals/messages.js';
import { cd } from '../../../global/modules/paths.js';
import { cache } from '../../../global/modules/cache.js';
import inject from '../../../global/modules/inject.js';
import {bind} from '../../../global/modules/wrapper.js';

function startAnim() {
    const message = 'Loading...';

    _('#create-btn').html(`<b>${message
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('')
    }</b>`);

    _('#create-btn').addClasses(['anim']);
}


async function listener() {
    startAnim();

    _('#create-btn').disabled = true;
    _('#join-btn').disabled = true;

    let videoResult = (await inject(messages.video)).result;
    let serverResult = videoResult ? (await inject(messages.server.connect)) : null; // Condition used to avoid server connection

    if (videoResult) {
        await cache('server', serverResult);
        window.location.href = cd(window.location.href, '../../create/create.html');
    }
}

function main() {
    _('#create-btn').on('click', listener);
}


bind(false).then(main);
