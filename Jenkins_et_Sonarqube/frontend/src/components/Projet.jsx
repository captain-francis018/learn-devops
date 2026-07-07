import { Link } from 'react-router-dom'

const statusStyles = {
  active:   'bg-gradient-to-r from-green-400 to-emerald-400 text-white',
  inactive: 'bg-gradient-to-r from-slate-300 to-slate-400 text-white',
  archived: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white',
}
const statusLabels = {
  active:   '✨ Actif',
  inactive: '💤 Inactif',
  archived: '📦 Archivé',
}

function Projet({ projet, onSupprimer, isAdmin = true }) {
  const techno = Array.isArray(projet.technologies)
    ? projet.technologies
    : (projet.technologies || '').split(',').map(t => t.trim()).filter(Boolean)

  return (
    <article className="bg-white border-2 border-slate-100 rounded-2xl flex flex-col
                        shadow-lg hover:shadow-2xl transform hover:-translate-y-2
                        transition-all duration-300 overflow-hidden">

      {/* Image ou placeholder avec gradient */}
      <div className="relative overflow-hidden h-44 bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
        {projet.image ? (
          <img
            src={projet.image}
            alt={projet.title}
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-7xl opacity-30">🎨</span>
          </div>
        )}

        {/* Badge statut mignon */}
        {projet.status && (
          <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1.5 rounded-full
                           shadow-lg ${statusStyles[projet.status] || statusStyles.active}`}>
            {statusLabels[projet.status] || projet.status}
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6 flex flex-col flex-1 gap-3">

        <Link
          to={`/projet/${projet._id}`}
          className="font-black text-slate-800 hover:text-purple-600 transition-colors leading-snug text-lg"
        >
          {projet.title}
        </Link>

        <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed flex-1">
          {projet.description}
        </p>

        {/* Technologies — style badge coloré */}
        {techno.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techno.slice(0, 4).map((tech, i) => (
              <span key={i}
                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700
                           text-xs font-bold px-3 py-1 rounded-full border border-purple-200">
                {tech}
              </span>
            ))}
            {techno.length > 4 && (
              <span className="text-xs text-slate-400 px-2 py-1 font-bold">
                +{techno.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Liens externes — avec emojis */}
        {(projet.githubUrl || projet.liveUrl) && (
          <div className="flex gap-3 text-xs border-t border-slate-100 pt-3">
            {projet.githubUrl && (
              <a href={projet.githubUrl} target="_blank" rel="noreferrer"
                className="text-slate-600 hover:text-slate-900 font-semibold transition">
                💻 GitHub
              </a>
            )}
            {projet.liveUrl && (
              <a href={projet.liveUrl} target="_blank" rel="noreferrer"
                className="text-purple-600 hover:text-purple-800 font-semibold transition">
                🚀 Demo
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-1 mt-auto">
          <Link
            to={`/projet/${projet._id}`}
            className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl
                       bg-gradient-to-r from-purple-500 to-pink-500 text-white
                       hover:from-purple-600 hover:to-pink-600
                       shadow-md hover:shadow-lg transition-all"
          >
            ✨ Détails
          </Link>
          {isAdmin && onSupprimer && (
            <button
              onClick={() => onSupprimer(projet._id)}
              className="flex-1 text-sm font-bold py-2.5 rounded-xl
                         bg-gradient-to-r from-red-400 to-pink-400 text-white
                         hover:from-red-500 hover:to-pink-500
                         shadow-md hover:shadow-lg transition-all"
            >
              🗑️ Supprimer
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default Projet
