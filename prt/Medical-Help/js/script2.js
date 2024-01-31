const service = document.querySelector('#service');
const banner = document.querySelector('#banner');
const navbar = document.querySelector('.navbar');

const obsCallback = function (entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) {
        navbar.classList.add('sticky');
    }
    else {
        navbar.classList.remove('sticky');
    }
}

const obsOptions = {
    root: null,
    threshold: 0,
}

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(service);