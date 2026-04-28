#!/bin/bash
set -euo pipefail

IP=$(hostname -I | awk '{print $2}')
echo "START - install postgres - $IP"

# ──────────────────────────────────────────────────────────────
# [1] Paquets de base
# ──────────────────────────────────────────────────────────────
echo "[1]: paquets de base"
apt-get update -qq >/dev/null
apt-get install -qq -y vim git wget curl ca-certificates >/dev/null

# ──────────────────────────────────────────────────────────────
# [2] PostgreSQL
# CORRECTION : postgresql-11 n'existe plus sur Debian 12 (bookworm).
#              La version disponible dans les dépôts officiels est
#              postgresql-15. On peut aussi installer via le dépôt
#              PGDG pour avoir le choix de version.
# ──────────────────────────────────────────────────────────────
echo "[2]: install PostgreSQL 15"

# Dépôt officiel PGDG (donne accès à toutes les versions récentes)
apt-get install -qq -y gnupg >/dev/null
curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  | gpg --dearmor -o /usr/share/keyrings/postgresql.gpg

echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] \
https://apt.postgresql.org/pub/repos/apt $(. /etc/os-release && echo "$VERSION_CODENAME")-pgdg main" \
  > /etc/apt/sources.list.d/pgdg.list

apt-get update -qq >/dev/null
apt-get install -qq -y postgresql-15 >/dev/null

# ──────────────────────────────────────────────────────────────
# [3] Création des utilisateurs et bases
# ──────────────────────────────────────────────────────────────
echo "[3]: init bases de données"
sudo -u postgres psql -c "CREATE USER vagrant WITH PASSWORD 'vagrant';"
sudo -u postgres psql -c "CREATE DATABASE dev   OWNER vagrant;"
sudo -u postgres psql -c "CREATE DATABASE stage OWNER vagrant;"
sudo -u postgres psql -c "CREATE DATABASE prod  OWNER vagrant;"

# ──────────────────────────────────────────────────────────────
# [4] Autoriser les connexions distantes
# CORRECTION : le chemin postgresql.conf dépend de la version.
#              On utilise un glob pour éviter de coder la version en dur.
# ──────────────────────────────────────────────────────────────
echo "[4]: config réseau PostgreSQL"
PG_CONF=$(find /etc/postgresql -name "postgresql.conf" | head -1)
PG_HBA=$(find /etc/postgresql  -name "pg_hba.conf"    | head -1)

sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" "$PG_CONF"
sed -i "s|127.0.0.1/32|0.0.0.0/0|"                               "$PG_HBA"

systemctl restart postgresql

echo "END - install postgres"
