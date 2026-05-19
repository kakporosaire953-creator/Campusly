// ============================================================
// CAMPUSLY — Lazy Loading Images & Content
// ============================================================

// Configuration
const CONFIG = {
  rootMargin: '50px',
  threshold: 0.01,
  loadingClass: 'lazy-loading',
  loadedClass: 'lazy-loaded',
  errorClass: 'lazy-error'
};

// Observer pour les images
let imageObserver = null;

// Initialiser le lazy loading
function initLazyLoading() {
  // Vérifier le support d'IntersectionObserver
  if (!('IntersectionObserver' in window)) {
    console.warn('[LazyLoad] IntersectionObserver non supporté, chargement immédiat');
    loadAllImages();
    return;
  }

  // Créer l'observer
  imageObserver = new IntersectionObserver(onIntersection, {
    rootMargin: CONFIG.rootMargin,
    threshold: CONFIG.threshold
  });

  // Observer toutes les images lazy
  observeLazyImages();
  
  // Observer les nouveaux éléments ajoutés au DOM
  observeDOM();
  
  console.log('[LazyLoad] Initialisé');
}

// Callback d'intersection
function onIntersection(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      loadElement(element);
      observer.unobserve(element);
    }
  });
}

// Charger un élément
function loadElement(element) {
  if (element.tagName === 'IMG') {
    loadImage(element);
  } else if (element.tagName === 'IFRAME') {
    loadIframe(element);
  } else if (element.hasAttribute('data-bg')) {
    loadBackground(element);
  }
}

// Charger une image
function loadImage(img) {
  const src = img.dataset.src;
  const srcset = img.dataset.srcset;
  
  if (!src && !srcset) return;
  
  img.classList.add(CONFIG.loadingClass);
  
  // Créer une nouvelle image pour précharger
  const tempImg = new Image();
  
  tempImg.onload = () => {
    // Appliquer l'image
    if (src) img.src = src;
    if (srcset) img.srcset = srcset;
    
    // Supprimer les data attributes
    delete img.dataset.src;
    delete img.dataset.srcset;
    
    // Mettre à jour les classes
    img.classList.remove(CONFIG.loadingClass);
    img.classList.add(CONFIG.loadedClass);
    
    // Animation de fade-in
    img.style.opacity = '0';
    requestAnimationFrame(() => {
      img.style.transition = 'opacity 0.3s ease';
      img.style.opacity = '1';
    });
  };
  
  tempImg.onerror = () => {
    img.classList.remove(CONFIG.loadingClass);
    img.classList.add(CONFIG.errorClass);
    console.error('[LazyLoad] Erreur chargement image:', src);
  };
  
  // Démarrer le chargement
  if (srcset) tempImg.srcset = srcset;
  if (src) tempImg.src = src;
}

// Charger un iframe
function loadIframe(iframe) {
  const src = iframe.dataset.src;
  if (!src) return;
  
  iframe.classList.add(CONFIG.loadingClass);
  iframe.src = src;
  delete iframe.dataset.src;
  
  iframe.onload = () => {
    iframe.classList.remove(CONFIG.loadingClass);
    iframe.classList.add(CONFIG.loadedClass);
  };
}

// Charger un background
function loadBackground(element) {
  const bg = element.dataset.bg;
  if (!bg) return;
  
  element.classList.add(CONFIG.loadingClass);
  
  const img = new Image();
  img.onload = () => {
    element.style.backgroundImage = `url(${bg})`;
    delete element.dataset.bg;
    element.classList.remove(CONFIG.loadingClass);
    element.classList.add(CONFIG.loadedClass);
  };
  
  img.onerror = () => {
    element.classList.remove(CONFIG.loadingClass);
    element.classList.add(CONFIG.errorClass);
  };
  
  img.src = bg;
}

// Observer les images lazy
function observeLazyImages() {
  // Images avec data-src
  const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
  lazyImages.forEach(img => imageObserver.observe(img));
  
  // Iframes avec data-src
  const lazyIframes = document.querySelectorAll('iframe[data-src]');
  lazyIframes.forEach(iframe => imageObserver.observe(iframe));
  
  // Éléments avec background lazy
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  lazyBackgrounds.forEach(el => imageObserver.observe(el));
}

// Observer les changements du DOM
function observeDOM() {
  const domObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          // Vérifier si c'est une image lazy
          if (node.matches && node.matches('img[data-src], img[data-srcset], iframe[data-src], [data-bg]')) {
            imageObserver.observe(node);
          }
          
          // Vérifier les enfants
          const lazyElements = node.querySelectorAll?.('img[data-src], img[data-srcset], iframe[data-src], [data-bg]');
          lazyElements?.forEach(el => imageObserver.observe(el));
        }
      });
    });
  });
  
  domObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Charger toutes les images immédiatement (fallback)
function loadAllImages() {
  const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
  lazyImages.forEach(img => {
    if (img.dataset.src) img.src = img.dataset.src;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    delete img.dataset.src;
    delete img.dataset.srcset;
  });
  
  const lazyIframes = document.querySelectorAll('iframe[data-src]');
  lazyIframes.forEach(iframe => {
    iframe.src = iframe.dataset.src;
    delete iframe.dataset.src;
  });
  
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  lazyBackgrounds.forEach(el => {
    el.style.backgroundImage = `url(${el.dataset.bg})`;
    delete el.dataset.bg;
  });
}

// Précharger une image
function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Précharger plusieurs images
async function preloadImages(urls) {
  const promises = urls.map(url => preloadImage(url));
  return Promise.allSettled(promises);
}

// Convertir une image en WebP si supporté
function supportsWebP() {
  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
}

// Obtenir l'URL WebP si disponible
function getWebPUrl(url) {
  if (!supportsWebP()) return url;
  
  // Remplacer l'extension par .webp
  return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

// Utilitaire pour créer une image lazy
function createLazyImage(src, alt = '', className = '') {
  const img = document.createElement('img');
  img.dataset.src = src;
  img.alt = alt;
  if (className) img.className = className;
  
  // Placeholder bas de gamme (LQIP)
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
  
  // Observer l'image
  if (imageObserver) {
    imageObserver.observe(img);
  }
  
  return img;
}

// Styles CSS pour lazy loading
const lazyStyles = document.createElement('style');
lazyStyles.textContent = `
  img[data-src], iframe[data-src], [data-bg] {
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  img.lazy-loaded, iframe.lazy-loaded, .lazy-loaded {
    opacity: 1;
  }
  
  img.lazy-loading, iframe.lazy-loading, .lazy-loading {
    opacity: 0.5;
    background: var(--surface);
  }
  
  img.lazy-error, iframe.lazy-error, .lazy-error {
    opacity: 0.3;
    background: var(--surface);
    position: relative;
  }
  
  img.lazy-error::after, .lazy-error::after {
    content: '⚠️';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 2rem;
  }
  
  /* Placeholder blur effect */
  img[data-src] {
    filter: blur(10px);
  }
  
  img.lazy-loaded {
    filter: blur(0);
  }
`;
document.head.appendChild(lazyStyles);

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}

// Exporter les fonctions
export {
  initLazyLoading,
  preloadImage,
  preloadImages,
  createLazyImage,
  supportsWebP,
  getWebPUrl
};
