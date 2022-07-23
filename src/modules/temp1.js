// import temp2 from './temp2.mjs';
export default function (m) {
    const channel = new BroadcastChannel('hello-world');
    channel.postMessage({ x: 'hello' });
    channel.onmessage =  (event) => {
        console.log(`This is from temp2, : ${event.data}`);
        console.log(event.data);
    };
    console.log('this has been loadedasdfSDFSDF');

    console.log(m);
}