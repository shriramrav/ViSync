import { bind } from '../../../global/modules/wrapper.js';
import inject from '../../../global/modules/inject.js';
import messages from '../../../global/modules/literals/messages.js';


/* NOTES:

- fix server so roomkey == user id
- finish video sync fn
- add join page
- add iframe support

*/

async function main() {
    let connection = JSON.parse(await inject(messages.server.create));
    let init = await inject(messages.server.init);


    _('#link-label').html(connection.key);
}


bind(false).then(main);