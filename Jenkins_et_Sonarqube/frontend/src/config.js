// ============================================================
// CONFIGURATION DU PORTFOLIO
// ============================================================

export const PROFILE = {
  // Photo de profil
  // Option 1 : Utiliser votre propre photo (recommandé)
  // Placez votre photo dans frontend/public/photo.jpg et décommentez :
  // photo: '/photo.jpg',

  // Option 2 : URL externe (Gravatar, LinkedIn, etc.)
  // photo: 'https://votre-url.com/photo.jpg',

  // Option 3 : Avatar généré automatiquement (par défaut)
  photo: 'https://ui-avatars.com/api/?name=Abdoukarim+Sy&background=2563eb&color=fff&size=256&bold=true',

  // Informations personnelles
  nom: 'Abdoukarim Sy',
  titre: 'Sysadmin · Réseau · Cloud · DevOps',
  localisation: 'Dakar, Sénégal',
  disponible: true,

  // Réseaux sociaux (optionnel)
  // Décommentez et ajoutez vos liens
  social: {
    // github: 'https://github.com/votre-username',
    // linkedin: 'https://linkedin.com/in/votre-profil',
    // twitter: 'https://twitter.com/votre-handle',
    // email: 'votre.email@example.com',
  }
}

// Fallback si l'image ne charge pas
export const PROFILE_FALLBACK = 'https://ui-avatars.com/api/?name=AS&background=2563eb&color=fff&size=256&bold=true'
