# Portfolio App — Déploiement K3s

Petit projet pédagogique : déployer une application 3-tiers (React + Node.js
+ MongoDB) sur un cluster **K3s** (version légère de Kubernetes), pour
illustrer le passage de Docker Compose/Swarm vers une vraie orchestration de
conteneurs.

> Ce repo fait suite à une série de projets DevOps : CI/CD avec Jenkins,
> qualité de code avec SonarQube, registry avec Docker Hub, et maintenant
> l'orchestration avec K3s.

## Architecture

```
┌─────────────┐      navigateur de l'utilisateur
│  Frontend   │◄──── http://<IP>:30080  (NodePort)
│  (React)    │
└──────┬──────┘
       │ appelle l'API via NodePort (pas via DNS interne !)
       ▼
┌─────────────┐
│  Backend    │◄──── http://<IP>:30081  (NodePort)
│  (Node.js)  │
└──────┬──────┘
       │ DNS interne au cluster : mongodb:27017
       ▼
┌─────────────┐
│  MongoDB    │  (ClusterIP — jamais exposé à l'extérieur)
└─────────────┘
```

**Point pédagogique important** : le frontend React s'exécute dans le
navigateur de l'utilisateur, donc **hors** du cluster Kubernetes. Il ne peut
pas utiliser les noms DNS internes (`backend`, `mongodb`) — seul le backend
le peut, car lui tourne *dans* un pod. C'est pourquoi le backend est exposé
en `NodePort` et pas seulement en `ClusterIP`.

## Structure du repo

```
.
├── Vagrantfile                     # Option A : VM K3s via Vagrant
├── k8s/
│   ├── namespace.yaml              # Namespace dédié "portfolio"
│   ├── mongodb.yaml                # PVC + Deployment + Service Mongo
│   ├── mongodb-secret.example.yaml # Modèle de secret (à copier, jamais le vrai)
│   ├── backend.yaml                # Deployment + Service backend (NodePort)
│   └── frontend.yaml               # Deployment + Service frontend (NodePort)
└── docs/
    └── DEPLOYMENT.md               # Toutes les commandes, étape par étape
```

## Prérequis

- `kubectl`
- **Une** des deux options ci-dessous pour avoir un cluster K3s

## Option A — Vagrant + VirtualBox (VM complète)

Idéal si tu veux une VM isolée façon "vraie infra".

```bash
vagrant up
vagrant ssh
cd /vagrant
cp k8s/mongodb-secret.example.yaml k8s/mongodb-secret.yaml
# édite le mot de passe dans k8s/mongodb-secret.yaml
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

Accès : `http://192.168.56.10:30080`

## Option B — k3d (sans VM, juste Docker)

Si tu n'as pas Vagrant/VirtualBox installés mais que tu as déjà **Docker**,
c'est l'option la plus rapide : k3d fait tourner K3s directement dans un
conteneur Docker, pas besoin de VM.

```bash
# Installation de k3d (une seule fois)
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# Création du cluster, avec les deux NodePorts exposés
k3d cluster create portfolio-demo \
  -p "30080:30080@loadbalancer" \
  -p "30081:30081@loadbalancer"

cp k8s/mongodb-secret.example.yaml k8s/mongodb-secret.yaml
# édite le mot de passe dans k8s/mongodb-secret.yaml
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/
```

Accès : `http://localhost:30080`

## Vérifier le déploiement

```bash
kubectl get all -n portfolio
kubectl logs -n portfolio deployment/backend
```

> 📋 Pour la liste complète des commandes (déploiement, vérification,
> dépannage), voir [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

## Nettoyer

```bash
# Option A
kubectl delete ns portfolio
vagrant destroy

# Option B
kubectl delete ns portfolio
k3d cluster delete portfolio-demo
```

## Limites connues / pistes d'amélioration

- Backend et frontend tournent en 2 replicas (stateless, donc safe à
  dupliquer). MongoDB reste en 1 replica : une vraie HA Mongo demanderait
  un Replica Set (StatefulSet, Service headless, élection de primaire) —
  hors scope d'un projet pédagogique mono-VM.
- Pas d'Ingress (volontairement — Traefik désactivé pour rester pédagogique
  sur les NodePort). Une V2 pourrait migrer vers un Ingress.
- Cluster à un seul node : si la VM tombe, tout tombe avec elle. La vraie
  haute disponibilité demanderait plusieurs nodes (plusieurs VMs).
- Le mot de passe MongoDB est géré via un `Secret` Kubernetes basique
  (`stringData`), suffisant pour un lab mais pas pour de la prod (où on
  utiliserait un vrai gestionnaire de secrets comme Vault ou Sealed Secrets).
