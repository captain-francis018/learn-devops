import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Projet from '../components/Projet'
import { API_URL } from '../api.js'
import { PlusIcon, LogoutIcon, SearchIcon, ChartIcon, CheckIcon, ArchiveIcon, CogIcon } from '../components/Icons'

function Admin() {
  const [projets, setProjets] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [recherche, setRecherche] = useState('')
  const navigate = useNavigate()

  useEffect(() => { chargerProjets() }, [])

  const chargerProjets = async () => {
    try {
      setChargement(true)
      setErreur(null)
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error('Erreur réseau ' + res.status)
      const data = await res.json()
      setProjets(data)
    } catch {
      setErreur("Impossible de charger les projets.")
    } finally {
      setChargement(false)
    }
  }

  const supprimerProjet = async (id) => {
    if (!window.confirm('Supprimer ce projet ? Cette action est irréversible.')) return
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      setProjets(projets.filter(p => p._id !== id))
    } catch {
      alert('Erreur lors de la suppression.')
    }
  }

  const deconnecter = () => {
    localStorage.removeItem('isAdmin')
    navigate('/')
  }

  const projetsFiltres = projets.filter(p => {
    if (!recherche) return true
    const q = recherche.toLowerCase()
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.technologies?.some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* Header Admin */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 border-b border-orange-600">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <CogIcon className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-black">Panneau Admin</h1>
                  <p className="text-orange-100 text-sm mt-1">
                    Gestion complète de votre portfolio
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/admin/ajouter"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-lg
                           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                           transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                Nouveau projet
              </Link>
              <button
                onClick={deconnecter}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-6 py-3 rounded-lg
                           border-2 border-white/30 hover:bg-white/20
                           transition-all duration-200"
              >
                <LogoutIcon className="w-5 h-5" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Stats rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ChartIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{projets.length}</div>
            <div className="text-sm text-slate-600 font-medium">Total projets</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckIcon className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {projets.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-slate-600 font-medium">Projets actifs</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
                <ArchiveIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {projets.filter(p => p.status === 'archived').length}
            </div>
            <div className="text-sm text-slate-600 font-medium">Archivés</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <CogIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">
              {new Set(projets.flatMap(p => p.technologies || [])).size}
            </div>
            <div className="text-sm text-slate-600 font-medium">Technologies</div>
          </div>
        </div>

        {/* Recherche */}
        {projets.length > 0 && (
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
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
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="font-bold text-red-900 mb-2 text-center text-lg">Erreur de connexion</p>
            <p className="text-red-600 text-center mb-6">{erreur}</p>
            <button onClick={chargerProjets}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition">
              Réessayer
            </button>
          </div>
        )}

        {/* Liste vide */}
        {!chargement && !erreur && projets.length === 0 && (
          <div className="text-center py-24">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <ChartIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-3xl font-bold text-slate-900 mb-3">Aucun projet</h3>
            <p className="text-slate-600 text-lg mb-8">
              Créez votre premier projet pour commencer
            </p>
            <Link to="/admin/ajouter"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600
                         hover:from-blue-700 hover:to-cyan-700 text-white font-bold px-8 py-4 rounded-lg
                         shadow-lg shadow-blue-600/30 hover:shadow-xl transform hover:-translate-y-0.5
                         transition-all duration-200">
              <PlusIcon className="w-5 h-5" />
              Créer le premier projet
            </Link>
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
              Aucun projet ne correspond à "{recherche}"
            </p>
            <button onClick={() => setRecherche('')}
              className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
              Effacer la recherche
            </button>
          </div>
        )}

        {/* Grille */}
        {!chargement && !erreur && projetsFiltres.length > 0 && (
          <>
            {recherche && (
              <p className="text-slate-600 mb-6 font-semibold">
                {projetsFiltres.length} résultat{projetsFiltres.length > 1 ? 's' : ''} pour "{recherche}"
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projetsFiltres.map(p => (
                <Projet key={p._id} projet={p} onSupprimer={supprimerProjet} isAdmin={true} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Admin
