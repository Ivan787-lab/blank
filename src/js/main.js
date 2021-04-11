import scss from '../css/style.scss';

document.querySelector('.nav__group-links').addEventListener('click' , (event) => {
    if (event.target.classList.contains('group-links__link')) {
        let arrWithActiveLinks = document.querySelectorAll('.group-links__link_active')
        if (arrWithActiveLinks.length >= 1) {
            for (let i = 0; i < arrWithActiveLinks.length; i++) {
                arrWithActiveLinks[i].classList.remove('group-links__link_active')
            }
        }
        event.target.classList.toggle('group-links__link_active')
    }
})