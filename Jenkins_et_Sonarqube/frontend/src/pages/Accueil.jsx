import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { API_URL } from '../api.js'
import { ServerIcon, GlobeIcon, CloudIcon, RocketIcon, ChartIcon, SparklesIcon } from '../components/Icons'
import { PROFILE, PROFILE_FALLBACK } from '../config'

function Accueil() {
  const [nbProjets, setNbProjets] = useState(null)

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(data => setNbProjets(Array.isArray(data) ? data.length : 0))
      .catch(() => setNbProjets(0))
  }, [])

  const domaines = [
    {
      icon: ServerIcon,
      label: 'Administration Système',
      desc: 'Linux, Windows Server, virtualisation (VMware, KVM), scripting Bash & PowerShell, gestion de services et automatisation.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: GlobeIcon,
      label: 'Réseau',
      desc: 'Configuration et sécurisation de réseaux LAN/WAN, routage, switching, VPN, pare-feux, protocoles TCP/IP, OSPF, BGP.',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: CloudIcon,
      label: 'Cloud & Infrastructure',
      desc: 'AWS (EC2, S3, VPC, IAM), infrastructure as code avec Terraform, déploiement et supervision d\'environnements cloud.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      icon: RocketIcon,
      label: 'Culture DevOps / SRE',
      desc: 'CI/CD (GitHub Actions), conteneurisation Docker, monitoring (Prometheus, Grafana), fiabilité et observabilité des systèmes.',
      color: 'from-indigo-600 to-purple-600',
    },
  ]

  const stack = [
    'Linux', 'Bash', 'Python', 'AWS', 'Terraform', 'Docker',
    'Kubernetes', 'Ansible', 'Prometheus', 'Grafana', 'Git',
    'GitHub Actions', 'Nginx', 'TCP/IP', 'OSPF', 'VPN',
  ]

  const stats = [
    { icon: ChartIcon, val: nbProjets ?? '—', label: 'Projets documentés', color: 'bg-blue-500' },
    { icon: SparklesIcon, val: '2+', label: 'Ans de formation', color: 'bg-cyan-500' },
    { icon: RocketIcon, val: '16+', label: 'Technologies', color: 'bg-indigo-500' },
    { icon: ServerIcon, val: 'ODC', label: 'Orange Digital Ctr', color: 'bg-blue-600' },
  ]

  return (
    <div className="bg-white">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">

        {/* Grille de fond */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Dégradés lumineux */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-8 py-20 md:py-32 relative z-10">

          {/* Photo de profil grande */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
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
                <span className="absolute bottom-2 right-2 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-green-500 border-2 border-white"></span>
                </span>
              )}
            </div>
          </div>

          {/* Badge statut */}
          {PROFILE.disponible && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-green-200 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-slate-700 font-semibold text-sm">
                Disponible — {PROFILE.localisation}
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6 text-slate-900">
            {PROFILE.nom}
          </h1>

          <p className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            {PROFILE.titre}
          </p>

          <p className="text-slate-600 text-lg mb-12 max-w-2xl leading-relaxed">
            Expert en infrastructures IT avec une passion pour l'automatisation, le cloud computing
            et les pratiques DevOps/SRE. Spécialisé dans la conception de solutions robustes et scalables.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/projets"
              className="inline-flex items-center justify-center gap-3
                         bg-gradient-to-r from-blue-600 to-cyan-600
                         hover:from-blue-700 hover:to-cyan-700
                         text-white font-bold px-8 py-4 rounded-lg
                         shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40
                         transform hover:-translate-y-0.5
                         transition-all duration-200"
            >
              <BriefcaseIcon className="w-5 h-5" />
              Voir mes projets
              {nbProjets !== null && nbProjets > 0 && (
                <span className="bg-white/20 text-xs px-2.5 py-1 rounded-md font-bold">
                  {nbProjets}
                </span>
              )}
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${s.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">
                    {s.val}
                  </div>
                  <div className="text-slate-600 text-sm font-medium">{s.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── DOMAINES ─────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-8">

          <div className="mb-16 text-center">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-3">Expertise</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Domaines de compétences
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Une expertise technique complète au service de vos infrastructures
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {domaines.map((d, i) => {
              const Icon = d.icon
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${d.color} mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-3">{d.label}</h3>
                  <p className="text-slate-600 leading-relaxed">{d.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── STACK ────────────────────────────────────────── */}
      <section className="bg-white py-20 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wider mb-3">Technologies</p>
            <h2 className="text-3xl font-black text-slate-900">Stack Technique</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {stack.map((tech, i) => (
              <span
                key={i}
                className="px-5 py-2.5 bg-slate-100 hover:bg-blue-50 border border-slate-200 hover:border-blue-300
                           text-slate-700 hover:text-blue-700 text-sm font-semibold rounded-lg
                           transition-all duration-200 cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 py-24">
        {/* Motif de fond */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Dégradés lumineux */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-sm mb-6">
            <BriefcaseIcon className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Découvrez mes réalisations
          </h2>
          <p className="text-blue-100 text-lg mb-10 leading-relaxed max-w-2xl mx-auto">
            Scripts d'automatisation, configurations réseau, déploiements cloud,
            pipelines CI/CD — explorez l'ensemble de mes projets techniques
          </p>
          <Link
            to="/projets"
            className="inline-flex items-center justify-center gap-2
                       bg-white text-blue-600 font-bold px-10 py-4 rounded-lg
                       shadow-2xl hover:shadow-3xl transform hover:scale-105
                       transition-all duration-200"
          >
            <SparklesIcon className="w-5 h-5" />
            Voir tous les projets
          </Link>
        </div>
      </section>

    </div>
  )
}

// Import BriefcaseIcon locally if needed
const BriefcaseIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

export default Accueil
