/**
 * Main entry point into all JavaScript.
 * @module main
 * @requires debounce
 * @requires throttle
 * @requires trigger-event
 * @author frontend@webit.de
 */

'use strict';

// Self-written modules
import { debounce } from './_utilities/debounce.js';
import { throttle } from './_utilities/throttle.js';
import { triggerEvent } from './_utilities/trigger-event.js';
import { initSwiperNavigationRemoval } from './_utilities/remove-swiper-navigation.js';
import InitSliderHero from "./swiper-slider/swiper-slider.js";
import InitImageZoom from "./image-zoom/image-zoom.js";
import InitSliderTestimonial from "./landing-page/landing-page.js";
import InitMenuOverlayPhone from "./header/header.js";
import InitFootballSite from "./football-site/football-site.js";


/**
 * Binds all events to DOM objects.
 * @function bindEvents
 */
function bindEvents() {
  window.addEventListener('resize',
    debounce(() => triggerEvent(window, 'resize:smart'), 250));
  window.addEventListener('scroll',
    throttle(() => triggerEvent(window, 'scroll:smart'), 250));
}

/**
 * Caches all objects for later use.
 * @function cacheElements
 */
function cacheElements() {

}

function init() {
  console.log('Initializing main application...');
  
  // Initialize swiper navigation removal FIRST, before any Swiper instances are created
  initSwiperNavigationRemoval();
  
  cacheElements();
  bindEvents();
  
  // Initialize modules with error handling
  try {
    InitSliderHero();
  } catch (error) {
    console.warn('InitSliderHero failed:', error);
  }
  
  try {
    InitImageZoom();
  } catch (error) {
    console.warn('InitImageZoom failed:', error);
  }
  
  try {
    InitSliderTestimonial();
  } catch (error) {
    console.warn('InitSliderTestimonial failed:', error);
  }
  
  try {
    InitMenuOverlayPhone();
  } catch (error) {
    console.warn('InitMenuOverlayPhone failed:', error);
  }
  
  try {
    InitFootballSite();
  } catch (error) {
    console.warn('InitFootballSite failed:', error);
  }
  
  console.log('Main application initialization complete');
};

init();