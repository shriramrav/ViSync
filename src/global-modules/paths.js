export function cd(curr, arg) {
    let dirs = curr.split('/');
    let args = arg.split('/');

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '..') {
            dirs.pop()
        } else if (args[i] !== '.') {
            dirs.push(args[i])
        }
    }

    return dirs.map(entry => entry + '/').join('').slice(0, -1);
}