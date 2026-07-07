import { useState, useEffect } from 'react'
import Projet from '../components/Projet'
import { API_URL } from '../api.js'
import { SearchIcon, CheckIcon, ClockIcon, ArchiveIcon, BriefcaseIcon } from '../components/Icons'

function ProjetsPublic() {
  const [projets, setProjets] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [filtre, setFiltre] = useState('all')
  const [recherche, setRecherche] = useState('')

  useEffect(() => { chargerProjets() }, [])

  const chargerProjets = async () => {
    try {
      setChargement(true)
      setErreur(null)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Erreur réseau')
      const data = await res.json()
      setProjets(data)
    } catch {
      setErreur("Impossible de charger les projets.")
    } finally {
      setChargement(false)
    }
  }

  const projetsFiltres = projets.filter(p => {
    if (filtre !== 'all' && p.status !== filtre) return false
    if (!recherche) return true
    const q = recherche.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.technologies?.some(t => t.toLowerCase().includes(q))
    )
  })

  const filtres = [
    { key: 'all', label: 'Tous', icon: BriefcaseIcon, count: projets.length, color: 'blue' },
    { key: 'active', label: 'Actifs', icon: CheckIcon, count: projets.filter(p => p.status === 'active').length, color: 'green' },
    { key: 'inactive', label: 'Inactifs', icon: ClockIcon, count: projets.filter(p => p.status === 'inactive').length, color: 'amber' },
    { key: 'archived', label: 'Archivés', icon: ArchiveIcon, count: projets.filter(p => p.status === 'archived').length, color: 'slate' },
  ]

  const getFilterClasses = (f) => {
    const isActive = filtre === f.key
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
      green: isActive ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-green-50 text-green-700 hover:bg-green-100',
      amber: isActive ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' : 'bg-amber-50 text-amber-700 hover:bg-amber-100',
      slate: isActive ? 'bg-slate-600 text-white shadow-lg shadow-slate-600/30' : 'bg-slate-50 text-slate-700 hover:bg-slate-100',
    }
    return colors[f.color]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Header professionnel */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20 border-b border-blue-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <BriefcaseIcon className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white text-center mb-4">
            Mes Projets
          </h1>
          <p className="text-blue-100 text-lg text-center max-w-3xl mx-auto">
            Découvrez mes réalisations techniques : scripts d'automatisation, configurations réseau,
            déploiements cloud et pipelines CI/CD
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Filtres */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {filtres.map(f => {
            const Icon = f.icon
            return (
              <button
                key={f.key}
                onClick={() => setFiltre(f.key)}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                           transition-all duration-200 border border-transparent
                           ${getFilterClasses(f)}`}
              >
                <Icon className="w-5 h-5" />
                {f.label}
                {f.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold
                                   ${filtre === f.key ? 'bg-white/20' : 'bg-white'}`}>
                    {f.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Recherche */}
        {projets.length > 0 && (
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un projet ou une technologie..."
                value={recherche}
                onChange={e => setRecherche(e.target.value)}
                className="w-full pl-12 pr-6 py-4 border-2 border-slate-200 rounded-lg
                           focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                           transition-all duration-200 font-medium shadow-sm"
              />
            </div>
          </div>
        )}

        {/* Chargement */}
        {chargement && (
          <div className="flex flex-col items-center py-24">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent
                            rounded-full animate-spin mb-4" />
            <p className="text-slate-600 font-semibold">Chargement des projets...</p>
          </div>
        )}

        {/* Erreur */}
        {erreur && (
          <div className="bg-white border-2 border-red-200 rounded-xl p-8 max-w-lg mx-auto shadow-lg">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <XIcon className="w-8 h-8 text-red-600" />
            </div>
            <p className="font-bold text-red-900 mb-2 text-center text-lg">Erreur de chargement</p>
            <p className="text-red-600 text-center mb-6">{erreur}</p>
            <button onClick={chargerProjets}
              className="w-full bg-red-600 hover:bg-red-700 text-white
                         font-bold px-6 py-3 rounded-lg
                         transition-all duration-200 shadow-lg">
              Réessayer
            </button>
          </div>
        )}

        {/* Liste vide */}
        {!chargement && !erreur && projets.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <BriefcaseIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Aucun projet</h3>
            <p className="text-slate-600 text-lg">
              Les projets arrivent bientôt
            </p>
          </div>
        )}

        {/* Aucun résultat */}
        {!chargement && !erreur && projets.length > 0 && projetsFiltres.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Aucun résultat</h3>
            <p className="text-slate-600 mb-6">
              {recherche && `Aucun projet ne correspond à "${recherche}"`}
              {!recherche && filtre !== 'all' && `Aucun projet ${filtre}`}
            </p>
            <div className="flex justify-center gap-4">
              {recherche && (
                <button onClick={() => setRecherche('')}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                  Effacer la recherche
                </button>
              )}
              {filtre !== 'all' && (
                <button onClick={() => setFiltre('all')}
                  className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                  Voir tous les projets
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grille */}
        {!chargement && !erreur && projetsFiltres.length > 0 && (
          <>
            {(recherche || filtre !== 'all') && (
              <p className="text-center text-slate-600 mb-8 font-semibold">
                {projetsFiltres.length} projet{projetsFiltres.length > 1 ? 's' : ''} trouvé{projetsFiltres.length > 1 ? 's' : ''}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetsFiltres.map(p => (
                <Projet key={p._id} projet={p} isAdmin={false} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// XIcon local si pas dans Icons
const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default ProjetsPublic
