import scss from '../css/style.scss';

document.querySelector('.nav__group-links').addEventListener('click', (event) => {
    if (event.target.classList.contains('nav__link')) {
        let arrWithActiveLinks = document.querySelectorAll('.nav__link_active')
        if (arrWithActiveLinks.length >= 1) {
            for (let i = 0; i < arrWithActiveLinks.length; i++) {
                arrWithActiveLinks[i].classList.remove('nav__link_active')
            }
        }
        event.target.classList.toggle('nav__link_active')
    }
})

for (let i = 1; i < 16; i++) {
    let partner = document.createElement('img')
    partner.src = `img/partners/partner__${i}.png`
    document.querySelector('.our-partners__images').append(partner)
}