// ============================================================
// CAMPUSLY — Validators (Validation des entrées)
// ============================================================

/**
 * Valide un matricule UAC (8 chiffres)
 * @param {string} matricule - Matricule à valider
 * @returns {object} { valid: boolean, error: string }
 */
export function validateMatricule(matricule) {
  if (!matricule) {
    return { valid: false, error: 'Le matricule est requis' };
  }
  
  const cleaned = matricule.trim();
  
  // Doit être exactement 8 chiffres
  if (!/^\d{8}$/.test(cleaned)) {
    return { valid: false, error: 'Le matricule doit contenir exactement 8 chiffres' };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide un email
 * @param {string} email - Email à valider
 * @returns {object} { valid: boolean, error: string }
 */
export function validateEmail(email) {
  if (!email) {
    return { valid: false, error: 'L\'email est requis' };
  }
  
  const cleaned = email.trim().toLowerCase();
  
  // Regex email standard
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(cleaned)) {
    return { valid: false, error: 'Format d\'email invalide' };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password) {
  const errors = [];
  
  if (!password) {
    return { valid: false, errors: ['Le mot de passe est requis'] };
  }
  
  if (password.length < 8) {
    errors.push('Au moins 8 caractères');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une lettre majuscule');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une lettre minuscule');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Au moins un chiffre');
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push('Au moins un symbole (@, #, !, %…)');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valide un fichier uploadé
 * @param {File} file - Fichier à valider
 * @param {object} options - Options de validation
 * @returns {object} { valid: boolean, error: string }
 */
export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB par défaut
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
    allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png']
  } = options;
  
  if (!file) {
    return { valid: false, error: 'Aucun fichier sélectionné' };
  }
  
  // Vérifier la taille
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024));
    return { valid: false, error: `Le fichier doit faire moins de ${maxMB}MB` };
  }
  
  // Vérifier le type MIME
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Type de fichier non autorisé. Types acceptés: ${allowedExtensions.join(', ')}` };
  }
  
  // Vérifier l'extension
  const extension = '.' + file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: `Extension non autorisée. Extensions acceptées: ${allowedExtensions.join(', ')}` };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide un nom (prénom/nom)
 * @param {string} name - Nom à valider
 * @param {string} fieldName - Nom du champ (pour le message d'erreur)
 * @returns {object} { valid: boolean, error: string }
 */
export function validateName(name, fieldName = 'Ce champ') {
  if (!name) {
    return { valid: false, error: `${fieldName} est requis` };
  }
  
  const cleaned = name.trim();
  
  if (cleaned.length < 2) {
    return { valid: false, error: `${fieldName} doit contenir au moins 2 caractères` };
  }
  
  if (cleaned.length > 50) {
    return { valid: false, error: `${fieldName} doit contenir moins de 50 caractères` };
  }
  
  // Seulement lettres, espaces, tirets et apostrophes
  if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(cleaned)) {
    return { valid: false, error: `${fieldName} contient des caractères invalides` };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide une faculté
 * @param {string} faculty - Faculté à valider
 * @returns {object} { valid: boolean, error: string }
 */
export function validateFaculty(faculty) {
  const validFaculties = [
    'FAST',
    'FADESP',
    'FASHS',
    'FSA',
    'FLASH',
    'INJEPS',
    'ENATSE',
    'FST',
    'FASEG'
  ];
  
  if (!faculty) {
    return { valid: false, error: 'La faculté est requise' };
  }
  
  if (!validFaculties.includes(faculty.toUpperCase())) {
    return { valid: false, error: 'Faculté invalide' };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide un numéro de téléphone béninois
 * @param {string} phone - Numéro à valider
 * @returns {object} { valid: boolean, error: string }
 */
export function validatePhone(phone) {
  if (!phone) {
    return { valid: false, error: 'Le numéro de téléphone est requis' };
  }
  
  // Nettoie le numéro
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Format béninois: +229 XX XX XX XX ou 229XXXXXXXX ou XXXXXXXX
  const beninRegex = /^(\+?229)?[0-9]{8}$/;
  
  if (!beninRegex.test(cleaned)) {
    return { valid: false, error: 'Format de numéro invalide (ex: 97000000)' };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide une URL
 * @param {string} url - URL à valider
 * @returns {object} { valid: boolean, error: string }
 */
export function validateUrl(url) {
  if (!url) {
    return { valid: false, error: 'L\'URL est requise' };
  }
  
  try {
    const parsed = new URL(url);
    
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: 'L\'URL doit commencer par http:// ou https://' };
    }
    
    return { valid: true, error: null };
  } catch {
    return { valid: false, error: 'Format d\'URL invalide' };
  }
}

/**
 * Valide un texte (post, commentaire)
 * @param {string} text - Texte à valider
 * @param {object} options - Options de validation
 * @returns {object} { valid: boolean, error: string }
 */
export function validateText(text, options = {}) {
  const {
    minLength = 1,
    maxLength = 5000,
    fieldName = 'Ce champ'
  } = options;
  
  if (!text) {
    return { valid: false, error: `${fieldName} est requis` };
  }
  
  const cleaned = text.trim();
  
  if (cleaned.length < minLength) {
    return { valid: false, error: `${fieldName} doit contenir au moins ${minLength} caractère(s)` };
  }
  
  if (cleaned.length > maxLength) {
    return { valid: false, error: `${fieldName} doit contenir moins de ${maxLength} caractères` };
  }
  
  return { valid: true, error: null };
}

/**
 * Valide un formulaire complet
 * @param {object} data - Données du formulaire
 * @param {object} rules - Règles de validation
 * @returns {object} { valid: boolean, errors: object }
 */
export function validateForm(data, rules) {
  const errors = {};
  let isValid = true;
  
  for (const [field, validators] of Object.entries(rules)) {
    const value = data[field];
    
    for (const validator of validators) {
      const result = validator(value);
      
      if (!result.valid) {
        errors[field] = result.error || result.errors?.[0] || 'Erreur de validation';
        isValid = false;
        break; // Arrête à la première erreur pour ce champ
      }
    }
  }
  
  return { valid: isValid, errors };
}
