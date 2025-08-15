function SliderTestimonials() {
    const swiper = new Swiper('.testimonials-slider', {
        direction: 'horizontal',
        loop: true, 
        slidesPerView: 'auto',
        spaceBetween: '120',
        centeredSlides: true,
        navigation: false, // Komplett deaktivieren statt nur enabled: false
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
        },
        // Callback um sicherzustellen, dass Navigation-Buttons entfernt werden
        on: {
            init: function() {
                // Entferne alle Navigation-Buttons nach der Initialisierung
                const navButtons = this.el.querySelectorAll('.swiper-button-next, .swiper-button-prev');
                navButtons.forEach(button => {
                    button.style.display = 'none';
                    button.style.visibility = 'hidden';
                    button.remove();
                });
            },
            slideChange: function() {
                // Entferne Navigation-Buttons auch bei Slide-Wechsel (falls sie dynamisch erstellt werden)
                const navButtons = this.el.querySelectorAll('.swiper-button-next, .swiper-button-prev');
                navButtons.forEach(button => {
                    button.style.display = 'none';
                    button.style.visibility = 'hidden';
                    button.remove();
                });
            }
        }
    })
    
    // Zusätzliche kontinuierliche Überwachung und Entfernung
    const removeNavButtons = () => {
        const testimonialSliders = document.querySelectorAll('.testimonials-slider');
        testimonialSliders.forEach(slider => {
            const navButtons = slider.querySelectorAll('.swiper-button-next, .swiper-button-prev');
            navButtons.forEach(button => {
                button.style.display = 'none';
                button.style.visibility = 'hidden';
                button.style.opacity = '0';
                button.style.pointerEvents = 'none';
                button.style.position = 'absolute';
                button.style.left = '-9999px';
                button.style.top = '-9999px';
                button.remove();
            });
        });
    };
    
    // Entferne Buttons alle 500ms
    setInterval(removeNavButtons, 500);
    
    // Entferne Buttons auch beim DOM-Update
    const observer = new MutationObserver(removeNavButtons);
    const testimonialSlider = document.querySelector('.testimonials-slider');
    if (testimonialSlider) {
        observer.observe(testimonialSlider, {
            childList: true,
            subtree: true
        });
    }
}
  
export default function init() {
  SliderTestimonials();
}  