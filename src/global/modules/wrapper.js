// Wraps elements with several helper functions
export async function bind(windowLoaded = true, callback = () => {}) {
    let _ = function(name) {
        let element = name.includes('#') ? document.getElementById(name.replace('#', '')) : document.querySelector(name);

        try {
            // Helper functions

            // Change to attach
            element.on = (event, fn) => element.addEventListener(event, fn);

            // Change to remove
            element.off = (event, fn) => element.removeEventListener(event, fn);
            element.html = html => element.innerHTML = html;
            element.val = () => element.value;
            element.addClasses = classes => classes.forEach(_class => element.classList.add(_class));
            element.removeClasses= classes => classes.forEach(_class => element.classList.remove(_class));
        
        } finally {
            return element;
        }
        
    }

    if (!windowLoaded) {
        // Waits for window to finish loading before adding wrapper
        await new Promise((resolve) => window.onload = resolve);
    }

    window._ = _;
    callback();
}