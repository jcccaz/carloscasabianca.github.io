document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.concept-item, .secondary-nav a');
    const smokePlume = document.querySelector('.smoke-plume');

    if (smokePlume) {
        navLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                smokePlume.classList.add('billowing');
                setTimeout(() => {
                    smokePlume.classList.remove('billowing');
                }, 1800);
            });
        });
    }
});