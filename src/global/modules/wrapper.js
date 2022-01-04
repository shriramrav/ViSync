// Element wrapper for more readability and ease of use
export function bind(loaded = true) {
    let _ = function(name) {
        let element = name.includes('#') ? document.getElementById(name.replace('#', '')) : document.querySelector(name);

        try {
            // Helper functions
            element.on = (event, fn) => element.addEventListener(event, fn);
            element.html = (html) => element.innerHTML = html;
            element.val = () => element.value;
            element.addClasses = (classes) => classes.forEach(_class => element.classList.add(_class));
            element.removeClasses= (classes) => classes.forEach(_class => element.classList.remove(_class));
        
        } catch (err) {
            console.log(err);
        }
        
        return element;
    }

    if (loaded) {
        window._ = _;

    } else {
        return new Promise((resolve) => {
            const listener = () => {
                window._ = _;
                window.removeEventListener('load', listener);
                resolve();
            }
            window.addEventListener('load', listener);
        });
    }
}