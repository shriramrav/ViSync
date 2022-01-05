export function loadingAnim(name) {
    const message = 'Loading...';

    _(name).html(`<b>${message
        .split('')
        .map(char => `<span>${char}</span>`)
        .join('')
    }</b>`);

    _(name).addClasses(['loading-anim']);
}