#!/bin/bash
set -euo pipefail

IP=$(hostname -I | awk '{print $2}')
echo "START - install registry - $IP"

# ──────────────────────────────────────────────────────────────
# [1] Paquets de base
# ──────────────────────────────────────────────────────────────
echo "[1]: paquets de base"
apt-get update -qq >/dev/null
apt-get install -qq -y git wget curl ca-certificates openssl gnupg >/dev/null

# ──────────────────────────────────────────────────────────────
# [2] Docker (même méthode que jenkins)
# CORRECTION : get.docker.com est toujours valide mais on utilise
#              le dépôt officiel pour avoir docker-compose-plugin.
# ──────────────────────────────────────────────────────────────
echo "[2]: install Docker"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -qq >/dev/null
apt-get install -qq -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null

# Shim pour garder la commande `docker-compose` (habitudes anciennes)
ln -sf /usr/libexec/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

# ──────────────────────────────────────────────────────────────
# [3] Certificats auto-signés
# ──────────────────────────────────────────────────────────────
echo "[3]: génération certificats TLS"
mkdir -p certs/
openssl req -x509 -newkey rsa:4096 -nodes \
  -keyout certs/myregistry.key \
  -out    certs/myregistry.crt \
  -days 365 \
  -subj "/CN=myregistry.my"

# ──────────────────────────────────────────────────────────────
# [4] htpasswd
# CORRECTION : docker run registry:2 fonctionne toujours, mais
#              on peut aussi utiliser le paquet apache2-utils.
# ──────────────────────────────────────────────────────────────
echo "[4]: génération htpasswd"
mkdir -p passwd/
apt-get install -qq -y apache2-utils >/dev/null
htpasswd -Bbn captain-francis password > passwd/htpasswd

# ──────────────────────────────────────────────────────────────
# [5] docker-compose.yml
# CORRECTION : la clé `version` est dépréciée depuis Compose spec 3.x
#              Docker Compose V2 l'ignore mais émet un warning ; on la
#              retire. Le port 5000 (et non 80) est exposé pour
#              correspondre à l'insecure-registry déclaré côté Jenkins.
# ──────────────────────────────────────────────────────────────
echo "[5]: création docker-compose-registry.yml"
mkdir -p data/

cat > docker-compose-registry.yml <<'EOF'
# Compose spec (pas de clé "version" — dépréciée depuis Compose V2)
services:
  registry:
    restart: always
    image: registry:2
    container_name: registry
    ports:
      - "5000:5000"
    environment:
      REGISTRY_HTTP_TLS_CERTIFICATE: /certs/myregistry.crt
      REGISTRY_HTTP_TLS_KEY:         /certs/myregistry.key
      REGISTRY_AUTH:                 htpasswd
      REGISTRY_AUTH_HTPASSWD_PATH:   /auth/htpasswd
      REGISTRY_AUTH_HTPASSWD_REALM:  "Registry Realm"
    volumes:
      - ./data:/var/lib/registry
      - ./certs:/certs
      - ./passwd:/auth
EOF

docker compose -f docker-compose-registry.yml up -d

echo "END - install registry"
