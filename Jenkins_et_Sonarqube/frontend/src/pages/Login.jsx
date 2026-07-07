import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Mot de passe simple (en production, utiliser une vraie authentification)
  const ADMIN_PASSWORD = 'Rimka@#123'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true')
      navigate('/admin')
    } else {
      setError('Mot de passe incorrect 😢')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Illustration mignonne */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full
                          bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 mb-4
                          shadow-lg animate-bounce">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">
            Zone Admin
          </h1>
          <p className="text-slate-500 text-sm">
            Connectez-vous pour gérer votre portfolio ✨
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-100">
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              🔑 Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200
                         focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                         outline-none transition-all duration-200"
              placeholder="Entrez votre mot de passe..."
              autoFocus
            />
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-red-200 text-red-600 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl font-bold text-white
                       bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                       hover:from-purple-600 hover:via-pink-600 hover:to-red-600
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
                       transition-all duration-200"
          >
            Se connecter 🚀
          </button>

        
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-slate-500 hover:text-slate-700 underline underline-offset-2"
          >
            ← Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
