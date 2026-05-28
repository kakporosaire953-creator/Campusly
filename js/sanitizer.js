// ============================================================
// CAMPUSLY — Sanitizer (Protection XSS)
// ============================================================

/**
 * Échappe les caractères HTML dangereux
 * @param {string} str - Texte à échapper
 * @returns {string} Texte sécurisé
 */
export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Sanitise du HTML en autorisant uniquement certaines balises
 * @param {string} html - HTML à sanitiser
 * @param {string[]} allowedTags - Balises autorisées
 * @returns {string} HTML sécurisé
 */
export function sanitizeHtml(html, allowedTags = ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre']) {
  if (!html) return '';
  
  const div = document.createElement('div');
  div.innerHTML = html;
  
  // Fonction récursive pour nettoyer les nœuds
  function cleanNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.cloneNode();
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      
      // Si la balise n'est pas autorisée, on garde juste le contenu texte
      if (!allowedTags.includes(tagName)) {
        const textNode = document.createTextNode(node.textContent);
        return textNode;
      }
      
      // Crée un nouveau nœud propre
      const cleanElement = document.createElement(tagName);
      
      // Pour les liens, on garde seulement href et on force target="_blank"
      if (tagName === 'a') {
        const href = node.getAttribute('href');
        if (href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/'))) {
          cleanElement.setAttribute('href', href);
          cleanElement.setAttribute('target', '_blank');
          cleanElement.setAttribute('rel', 'noopener noreferrer');
        }
      }
      
      // Nettoie récursivement les enfants
      Array.from(node.childNodes).forEach(child => {
        const cleanChild = cleanNode(child);
        if (cleanChild) cleanElement.appendChild(cleanChild);
      });
      
      return cleanElement;
    }
    
    return null;
  }
  
  const cleanDiv = document.createElement('div');
  Array.from(div.childNodes).forEach(child => {
    const cleanChild = cleanNode(child);
    if (cleanChild) cleanDiv.appendChild(cleanChild);
  });
  
  return cleanDiv.innerHTML;
}

/**
 * Sanitise du Markdown simple (pour les posts du forum)
 * @param {string} markdown - Texte markdown
 * @returns {string} HTML sécurisé
 */
export function sanitizeMarkdown(markdown) {
  if (!markdown) return '';
  
  let html = escapeHtml(markdown);
  
  // Gras **texte**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italique *texte*
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Code `code`
  html = html.replace(/`(.+?)`/g, '<code>$1</code>');
  
  // Liens [texte](url)
  html = html.replace(/\[(.+?)\]\((https?:\/\/.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Sauts de ligne
  html = html.replace(/\n/g, '<br>');
  
  return html;
}

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {boolean} true si l'URL est valide et sûre
 */
export function isValidUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/**
 * Sanitise un nom de fichier
 * @param {string} filename - Nom de fichier
 * @returns {string} Nom de fichier sécurisé
 */
export function sanitizeFilename(filename) {
  if (!filename) return 'file';
  
  // Garde seulement les caractères alphanumériques, tirets, underscores et points
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.') // Pas de .. (path traversal)
    .substring(0, 255); // Limite de longueur
}
