import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_URL } from '../api.js'

function AjouterProjet() {
  const [title,        setTitle]        = useState('')
  const [description,  setDescription]  = useState('')
  const [technologies, setTechnologies] = useState('')
  const [status,       setStatus]       = useState('active')
  const [image,        setImage]        = useState('')
  const [githubUrl,    setGithubUrl]    = useState('')
  const [liveUrl,      setLiveUrl]      = useState('')
  const [envoi,        setEnvoi]        = useState(false)
  const [erreur,       setErreur]       = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setEnvoi(true)
    setErreur(null)

    const projet = {
      title,
      description,
      technologies: technologies.split(',').map(t => t.trim()).filter(Boolean),
      status,
      ...(image     && { image }),
      ...(githubUrl && { githubUrl }),
      ...(liveUrl   && { liveUrl }),
    }

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projet)
      })
      if (!res.ok) throw new Error('Erreur serveur ' + res.status)
      navigate('/admin')
    } catch {
      setErreur("Impossible d'ajouter le projet. Vérifiez que l'API tourne.")
      setEnvoi(false)
    }
  }

  const inputClass = "w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-sm bg-white " +
    "focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all"

  const Label = ({ htmlFor, children, emoji, optional }) => (
    <label htmlFor={htmlFor} className="block text-sm font-bold text-slate-700 mb-2">
      {emoji && <span className="mr-2">{emoji}</span>}
      {children}
      {optional && <span className="text-slate-400 font-normal ml-2 text-xs">(optionnel)</span>}
    </label>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-6">

        {/* Header mignon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full
                          bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 mb-4
                          shadow-lg animate-bounce">
            <span className="text-4xl">✨</span>
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Nouveau Projet
          </h1>
          <p className="text-slate-600 font-semibold">
            Documente une réalisation technique 🎯
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border-2 border-slate-100 overflow-hidden">

          <div className="p-8 space-y-6">

            {erreur && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl text-red-700 p-4 text-sm font-semibold text-center">
                😢 {erreur}
              </div>
            )}

            <div>
              <Label htmlFor="title" emoji="📝">Titre du projet *</Label>
              <input id="title" type="text" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : Automatisation Ansible, Monitoring Prometheus..."
                required className={inputClass} />
            </div>

            <div>
              <Label htmlFor="description" emoji="📄">Description *</Label>
              <textarea id="description" rows={5} value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Contexte, objectifs, ce que tu as mis en place..."
                required className={`${inputClass} resize-y`} />
            </div>

            <div>
              <Label htmlFor="technologies" emoji="🛠️">Technologies</Label>
              <input id="technologies" type="text" value={technologies}
                onChange={e => setTechnologies(e.target.value)}
                placeholder="Linux, Docker, Terraform, Ansible (séparées par des virgules)"
                className={inputClass} />
              {technologies && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {technologies.split(',').map((t, i) => t.trim() && (
                    <span key={i} className="bg-gradient-to-r from-purple-100 to-pink-100
                                             text-purple-700 text-xs font-bold px-3 py-1.5
                                             rounded-full border border-purple-200">
                      {t.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="status" emoji="🎯">Statut</Label>
              <select id="status" value={status} onChange={e => setStatus(e.target.value)}
                className={inputClass}>
                <option value="active">✨ Actif</option>
                <option value="inactive">💤 Inactif</option>
                <option value="archived">📦 Archivé</option>
              </select>
            </div>

            <div>
              <Label htmlFor="image" emoji="🎨" optional>URL de l'image de couverture</Label>
              <input id="image" type="url" value={image}
                onChange={e => setImage(e.target.value)}
                placeholder="https://..."
                className={inputClass} />
              {image && (
                <div className="mt-3 rounded-2xl overflow-hidden border-2 border-purple-200">
                  <img src={image} alt="Aperçu"
                    className="w-full h-48 object-cover"
                    onError={e => e.target.style.display = 'none'} />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="github" emoji="💻" optional>URL GitHub</Label>
                <input id="github" type="url" value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className={inputClass} />
              </div>
              <div>
                <Label htmlFor="live" emoji="🚀" optional>URL Demo live</Label>
                <input id="live" type="url" value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className={inputClass} />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" onClick={handleSubmit} disabled={envoi}
                className="flex-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                           hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                           text-white font-black py-4 rounded-xl text-sm
                           shadow-lg hover:shadow-xl transform hover:-translate-y-1
                           transition-all disabled:opacity-50 disabled:cursor-not-allowed
                           disabled:transform-none">
                {envoi ? '⏳ Envoi en cours...' : '✨ Créer le projet'}
              </button>
              <button type="button" onClick={() => navigate('/admin')}
                className="flex-1 border-2 border-slate-200 text-slate-600 font-bold
                           py-4 rounded-xl text-sm hover:bg-slate-50
                           transition-all">
                ❌ Annuler
              </button>
            </div>

          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/admin"
            className="text-sm text-slate-600 hover:text-purple-600 font-semibold underline underline-offset-2">
            ← Retour au panneau admin
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AjouterProjet
