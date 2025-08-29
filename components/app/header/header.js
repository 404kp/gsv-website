function MenuOverlayPhone() {
    // Get DOM elements
    const hamburgerMenu = document.querySelector(".hamburger-menu");
    const menuOverlay = document.getElementById("menu-overlay");
    const closeButton = document.querySelector(".close-menu-overlay");
  
    // Debug: Check if elements are found
    console.log('Hamburger Menu Element:', hamburgerMenu);
    console.log('Menu Overlay Element:', menuOverlay);
    console.log('Close Button Element:', closeButton);
  
    // Early return if required elements don't exist
    if (!hamburgerMenu || !menuOverlay || !closeButton) {
      console.error('One or more menu elements not found');
      return;
    }
  
    // Track menu state
    let isMenuOpen = false;
  
    // Initialize the menu
    function init() {
      console.log('Initializing menu overlay...');
      setupEventListeners();
      updateMenuState();
    }
  
    // Set up all event listeners
    function setupEventListeners() {
      console.log('Setting up event listeners...');
      // Hamburger button
      hamburgerMenu.addEventListener("click", handleHamburgerClick);
      hamburgerMenu.addEventListener("keydown", handleHamburgerKeydown);
  
      // Close button
      closeButton.addEventListener("click", handleCloseClick);
      closeButton.addEventListener("keydown", handleCloseKeydown);
  
      // Menu overlay
      menuOverlay.addEventListener("keydown", handleOverlayKeydown);
  
      // Menu links
      const menuLinks = menuOverlay.querySelectorAll("a");
      menuLinks.forEach(link => {
        link.addEventListener("click", handleLinkClick);
      });
      console.log('Event listeners set up successfully');
    }
  
    // Event handlers
    function handleHamburgerClick() {
      console.log('Hamburger clicked!');
      toggleMenu();
    }
  
    function handleHamburgerKeydown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu();
      }
    }
  
    function handleCloseClick() {
      closeMenu();
    }
  
    function handleCloseKeydown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        closeMenu();
      }
    }
  
    function handleOverlayKeydown(e) {
      if (e.key === "Escape") {
        closeMenu();
      }
    }
  
    function handleLinkClick() {
      closeMenu();
    }
  
    // Menu actions
    function toggleMenu() {
      console.log('Toggle menu called, current state:', isMenuOpen);
      isMenuOpen = !isMenuOpen;
      console.log('New menu state:', isMenuOpen);
      updateMenuState();
    }
  
    function closeMenu() {
      isMenuOpen = false;
      updateMenuState();
      hamburgerMenu.focus();
    }
  
    // Update UI state
    function updateMenuState() {
      console.log('Updating menu state to:', isMenuOpen);
      // Update ARIA attributes
      hamburgerMenu.setAttribute("aria-expanded", isMenuOpen);
      menuOverlay.setAttribute("aria-hidden", !isMenuOpen);
      
      // Update tabindex for all focusable elements
      const focusableElements = menuOverlay.querySelectorAll('a, button, [tabindex]');
      focusableElements.forEach(el => {
        el.setAttribute("tabindex", isMenuOpen ? "0" : "-1");
      });

      // Update visual state using CSS classes
      if (isMenuOpen) {
        console.log('Adding menu-open class');
        menuOverlay.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        // Focus first focusable element in menu
        setTimeout(() => {
          const firstFocusable = menuOverlay.querySelector('a, button');
          if (firstFocusable) firstFocusable.focus();
        }, 100);
      } else {
        console.log('Removing menu-open class');
        menuOverlay.classList.remove('menu-open');
        document.body.style.overflow = '';
      }

      // Update hamburger animation
      if (isMenuOpen) {
        hamburgerMenu.classList.add('hamburger-open');
      } else {
        hamburgerMenu.classList.remove('hamburger-open');
      }
    }    // Initialize focus trap when menu is open
    function setupFocusTrap() {
      const focusableElements = menuOverlay.querySelectorAll('a, button, [tabindex="0"]');
      if (focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
  
        firstElement.addEventListener("keydown", (e) => {
          if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            lastElement.focus();
          }
        });
  
        lastElement.addEventListener("keydown", (e) => {
          if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            firstElement.focus();
          }
        });
      }
    }
  
    // Initialize the menu
    init();
    setupFocusTrap();
  }
  
  export default function init() {
    console.log('Header module init called');
    
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      console.log('DOM still loading, waiting for DOMContentLoaded...');
      document.addEventListener('DOMContentLoaded', MenuOverlayPhone);
    } else {
      // DOM is already loaded
      console.log('DOM already loaded, initializing menu immediately');
      MenuOverlayPhone();
    }
  }