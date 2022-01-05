import m from '../../../global/modules/literals/messages.js';
import { cd } from '../../../global/modules/paths.js';
import inject from '../../../global/modules/inject.js';
import { bind } from '../../../global/modules/wrapper.js';


function listener() {
    window.close();
}

async function main() {
    _('#close-btn').on('click', listener);

    if (await inject(m.video)) {
        window.location.href = cd(window.location.href, '../../main/main.html');
    }
}


bind(false, main);

