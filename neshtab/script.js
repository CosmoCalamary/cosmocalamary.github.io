// Получаем элементы
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const sideMenu = document.getElementById('sideMenu');

// Открытие меню
menuToggle.addEventListener('click', () => {
    sideMenu.classList.add('active');
});

// Закрытие меню
menuClose.addEventListener('click', () => {
    sideMenu.classList.remove('active');
});

// Закрытие меню при клике вне его
document.addEventListener('click', (e) => {
    if (!sideMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        sideMenu.classList.remove('active');
    }
});

// Закрытие меню при клике на ссылку
const menuLinks = document.querySelectorAll('.side-menu-list a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        sideMenu.classList.remove('active');
    });
});

// Аккордеон функционал
const accordionHeaders = document.querySelectorAll('.accordion-header');

accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const accordionItem = this.parentElement;
        const isActive = accordionItem.classList.contains('active');
        
        // Закрываем все аккордеоны на том же уровне
        const siblings = Array.from(accordionItem.parentElement.children).filter(
            el => el.classList.contains('accordion-item')
        );
        
        siblings.forEach(sibling => {
            if (sibling !== accordionItem) {
                sibling.classList.remove('active');
            }
        });
        
        // Переключаем текущий аккордеон
        if (isActive) {
            accordionItem.classList.remove('active');
        } else {
            accordionItem.classList.add('active');
        }
    });
});

// Плавная прокрутка к секциям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
