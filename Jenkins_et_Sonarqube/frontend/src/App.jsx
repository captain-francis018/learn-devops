import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

import Accueil         from './pages/Accueil'
import ProjetsPublic   from './pages/ProjetsPublic'
import Login           from './pages/Login'
import Admin           from './pages/Admin'
import AjouterProjet   from './components/AjouterProjet'
import DetaillerProjet from './components/DetaillerProjet'
import ProtectedRoute  from './components/ProtectedRoute'
import { HomeIcon, BriefcaseIcon, UserIcon, LockIcon } from './components/Icons'
import { PROFILE, PROFILE_FALLBACK } from './config'

function Header() {
  const location = useLocation()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const isActive = (path) => location.pathname === path
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  // Ne pas afficher le header sur les pages admin et login
  if (location.pathname.startsWith('/admin') || location.pathname === '/login') {
    return null
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo professionnel */}
        <Link to="/" className="flex items-center gap-4 group">
          {/* Photo de profil */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200 group-hover:border-blue-400 transition-all duration-200 shadow-md">
              <img
                src={PROFILE.photo}
                alt={PROFILE.nom}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = PROFILE_FALLBACK
                }}
              />
            </div>
            {/* Badge disponible */}
            {PROFILE.disponible && (
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div className="hidden sm:block">
            <p className="font-black text-slate-900 text-lg leading-none">
              {PROFILE.nom}
            </p>
            <p className="text-slate-600 text-sm mt-1 font-medium">{PROFILE.titre}</p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-2">
          <Link to="/"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200
                       ${isActive('/')
                         ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                         : 'text-slate-700 hover:bg-slate-100'}`}>
            <HomeIcon className="w-4 h-4" />
            Accueil
          </Link>
          <Link to="/projets"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all duration-200
                       ${isActive('/projets')
                         ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                         : 'text-slate-700 hover:bg-slate-100'}`}>
            <BriefcaseIcon className="w-4 h-4" />
            Projets
          </Link>
          {isAdmin ? (
            <Link to="/admin"
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white
                         px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-orange-500/30
                         hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <UserIcon className="w-4 h-4" />
              Admin
            </Link>
          ) : (
            <Link to="/login"
              className="ml-2 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white
                         px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/30
                         hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              <LockIcon className="w-4 h-4" />
              Connexion
            </Link>
          )}
        </nav>

        {/* Burger mobile */}
        <button
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition"
          onClick={() => setMenuOuvert(!menuOuvert)}
        >
          <div className={`w-6 h-0.5 bg-current mb-1.5 rounded transition-all ${menuOuvert ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-current mb-1.5 rounded transition-all ${menuOuvert ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-current rounded transition-all ${menuOuvert ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Menu mobile */}
      {menuOuvert && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-2 shadow-lg">
          <Link to="/" onClick={() => setMenuOuvert(false)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition
                       ${isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}>
            <HomeIcon className="w-4 h-4" />
            Accueil
          </Link>
          <Link to="/projets" onClick={() => setMenuOuvert(false)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition
                       ${isActive('/projets') ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}>
            <BriefcaseIcon className="w-4 h-4" />
            Projets
          </Link>
          {isAdmin ? (
            <Link to="/admin" onClick={() => setMenuOuvert(false)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white
                         px-4 py-2.5 rounded-lg font-bold text-center mt-2 justify-center">
              <UserIcon className="w-4 h-4" />
              Admin
            </Link>
          ) : (
            <Link to="/login" onClick={() => setMenuOuvert(false)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white
                         px-4 py-2.5 rounded-lg font-bold text-center mt-2 justify-center">
              <LockIcon className="w-4 h-4" />
              Connexion
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

function App() {
  const location = useLocation()
  const showFooter = !location.pathname.startsWith('/admin') && location.pathname !== '/login'

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50/30 via-pink-50/30 to-blue-50/30">
      <Header />

      <main className="flex-1">
        <Routes>
          <Route path="/"           element={<Accueil />} />
          <Route path="/projets"    element={<ProjetsPublic />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/admin"      element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/ajouter" element={<ProtectedRoute><AjouterProjet /></ProtectedRoute>} />
          <Route path="/projet/:id" element={<DetaillerProjet />} />
        </Routes>
      </main>

      {showFooter && (
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
              <div className="flex items-center gap-4">
                {/* Photo de profil dans le footer */}
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-700">
                  <img
                    src={PROFILE.photo}
                    alt={PROFILE.nom}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = PROFILE_FALLBACK
                    }}
                  />
                </div>
                <div>
                  <p className="text-white text-lg font-bold">{PROFILE.nom}</p>
                  <p className="text-sm">{PROFILE.titre}</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <Link to="/" className="hover:text-white transition font-semibold flex items-center gap-2">
                  <HomeIcon className="w-4 h-4" />
                  Accueil
                </Link>
                <Link to="/projets" className="hover:text-white transition font-semibold flex items-center gap-2">
                  <BriefcaseIcon className="w-4 h-4" />
                  Projets
                </Link>
                <Link to="/login" className="hover:text-blue-400 transition font-semibold flex items-center gap-2">
                  <LockIcon className="w-4 h-4" />
                  Admin
                </Link>
              </div>
            </div>
            <div className="text-center text-xs border-t border-slate-800 pt-6">
              <p>© {new Date().getFullYear()} Abdoukarim Sy — Portfolio technique</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

export default App
