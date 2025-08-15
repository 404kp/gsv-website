/**
 * Utility to completely remove Swiper navigation buttons
 * This function aggressively removes all navigation buttons from all Swiper instances
 * @author frontend@webit.de
 */

'use strict';

/**
 * Removes all swiper navigation buttons from the page
 */
function removeAllSwiperNavigationButtons() {
    // Find all navigation buttons on the page
    const allNavButtons = document.querySelectorAll(
        '.swiper-button-next, .swiper-button-prev, [class*="swiper-button"]'
    );
    
    allNavButtons.forEach(button => {
        // Apply multiple hiding methods
        button.style.display = 'none';
        button.style.visibility = 'hidden';
        button.style.opacity = '0';
        button.style.pointerEvents = 'none';
        button.style.position = 'absolute';
        button.style.left = '-99999px';
        button.style.top = '-99999px';
        button.style.width = '0';
        button.style.height = '0';
        button.style.overflow = 'hidden';
        
        // Add classes to hide
        button.classList.add('hidden', 'sr-only');
        
        // Remove from DOM
        try {
            button.remove();
        } catch (e) {
            // Fallback if remove fails
            button.parentNode?.removeChild(button);
        }
    });
}

/**
 * Initialize the navigation button removal system
 */
export function initSwiperNavigationRemoval() {
    // Remove buttons immediately
    removeAllSwiperNavigationButtons();
    
    // Remove buttons when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAllSwiperNavigationButtons);
    }
    
    // Set up MutationObserver to watch for dynamically added buttons
    const observer = new MutationObserver((mutations) => {
        let shouldRemove = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself is a navigation button
                        if (node.classList?.contains('swiper-button-next') || 
                            node.classList?.contains('swiper-button-prev') ||
                            node.className?.includes('swiper-button')) {
                            shouldRemove = true;
                        }
                        // Check if the node contains navigation buttons
                        else if (node.querySelector && 
                                node.querySelector('.swiper-button-next, .swiper-button-prev')) {
                            shouldRemove = true;
                        }
                    }
                });
            }
        });
        
        if (shouldRemove) {
            // Small delay to ensure DOM is stable
            setTimeout(removeAllSwiperNavigationButtons, 10);
        }
    });
    
    // Start observing the entire document
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    
    // Periodic cleanup every 1 second as a fallback
    setInterval(removeAllSwiperNavigationButtons, 1000);
    
    // Remove buttons on window load and focus events
    window.addEventListener('load', removeAllSwiperNavigationButtons);
    window.addEventListener('focus', removeAllSwiperNavigationButtons);
    window.addEventListener('resize', removeAllSwiperNavigationButtons);
    
    console.log('Swiper navigation removal system initialized');
}
