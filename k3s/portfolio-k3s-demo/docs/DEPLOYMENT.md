# Étapes de déploiement et vérification

Ce document liste, dans l'ordre, toutes les commandes pour déployer puis
vérifier l'application — que tu utilises Vagrant ou k3d.

## 1. Démarrer le cluster K3s

### Option A — Vagrant (VM complète)
```bash
vagrant up
# Si la VM existe déjà et que tu modifies le Vagrantfile :
vagrant provision
```

### Option B — k3d (sans VM, juste Docker)
```bash
k3d cluster create portfolio-demo \
  -p "30080:30080@loadbalancer" \
  -p "30081:30081@loadbalancer"
```

## 2. Vérifier que le cluster est prêt

```bash
kubectl get nodes
kubectl get pods -A
```
**Attendu** : un node en statut `Ready`. Aucun pod `traefik` dans la liste
(désactivé volontairement, cf. README).

> Avec Vagrant, ces commandes s'exécutent **dans la VM** (`vagrant ssh`
> d'abord). Avec k3d, elles s'exécutent directement sur ta machine.

## 3. Préparer le secret MongoDB

```bash
cp k8s/mongodb-secret.example.yaml k8s/mongodb-secret.yaml
nano k8s/mongodb-secret.yaml   # remplace CHANGE_ME par un vrai mot de passe
```
⚠️ Ce fichier ne doit jamais être commité (il est dans `.gitignore`).

## 4. Déployer l'application

```bash
# Créer le namespace dédié
kubectl apply -f k8s/namespace.yaml

# Déployer tous les composants (mongodb, backend, frontend, secret)
kubectl apply -f k8s/

# Attendre que tout soit prêt (jusqu'à 2 min)
kubectl wait --for=condition=available --timeout=120s deployment --all -n portfolio
```

## 5. Vérifier le déploiement en détail

```bash
# Vue d'ensemble
kubectl get all -n portfolio

# Suivre le démarrage des pods en temps réel
kubectl get pods -n portfolio -w        # Ctrl+C pour quitter

# Logs d'un composant en cas de souci
kubectl logs -n portfolio deployment/backend
kubectl logs -n portfolio deployment/mongodb

# Décrire un pod qui ne démarre pas (CrashLoopBackOff, Pending, etc.)
kubectl describe pod -n portfolio <nom-du-pod>
```
**Attendu** : tous les pods en `Running`, colonne `READY` du type `1/1`.

## 6. Tester l'accès à l'application

### Option A — Vagrant
```bash
curl http://192.168.56.10:30080
# ou ouvrir dans le navigateur : http://192.168.56.10:30080
```

### Option B — k3d
```bash
curl http://localhost:30080
# ou ouvrir dans le navigateur : http://localhost:30080
```

## 7. Nettoyer

```bash
kubectl delete ns portfolio

# Option A
vagrant destroy -f

# Option B
k3d cluster delete portfolio-demo
```

## Dépannage rapide

| Symptôme | Commande de diagnostic |
|---|---|
| Pod en `Pending` | `kubectl describe pod -n portfolio <pod>` (souvent : PVC non lié, ressources insuffisantes) |
| Pod en `CrashLoopBackOff` | `kubectl logs -n portfolio <pod> --previous` |
| Backend ne répond pas | `kubectl get svc -n portfolio` (vérifier le NodePort), puis `kubectl logs -n portfolio deployment/backend` |
| MongoDB inaccessible | `kubectl exec -it -n portfolio deployment/mongodb -- mongosh` |
