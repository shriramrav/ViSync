// Element wrapper for more readability and ease of use
export default function(name) {
	let element;
	if (name.includes('#')) {
		element = document.getElementById(name.replace('#', ''));
	} else {
		element = document.querySelector(name);
	}

    // Helper functions
    element.on = (event, fn) => element.addEventListener(event, fn);
    element.html = (html) => element.innerHTML = html;
    element.addClasses = (classes) => classes.forEach(_class => element.classList.add(_class));
    element.removeClasses= (classes) => classes.forEach(_class => element.classList.remove(_class));

    return element;
}
