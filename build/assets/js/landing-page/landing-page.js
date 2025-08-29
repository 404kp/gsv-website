function SliderTestimonials() {
    // Check if Swiper is available
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper is not loaded yet, skipping testimonials slider initialization');
        return;
    }
    
    // Check if the testimonials slider element exists
    const testimonialSliderElement = document.querySelector('.testimonials-slider');
    if (!testimonialSliderElement) {
        console.log('Testimonials slider element not found on this page, skipping initialization');
        return;
    }
    
    console.log('Initializing testimonials slider...');
    
    const swiper = new Swiper('.testimonials-slider', {
        direction: 'horizontal',
        loop: true, 
        slidesPerView: 'auto',
        spaceBetween: '120',
        centeredSlides: true,
        navigation: true, // Pfeil-Navigation komplett deaktivieren
        pagination: {
            el: '.testimonial-pagination',
            clickable: true,
            dynamicBullets: true, // Schönere Darstellung bei vielen Slides
        },
        // Touch/Mouse-Navigation erlauben
        allowTouchMove: true,
        grabCursor: true,
        // Keyboard-Navigation
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
    });
    
    console.log('Testimonials slider initialized successfully');
}
  
export default function init() {
  SliderTestimonials();
}  