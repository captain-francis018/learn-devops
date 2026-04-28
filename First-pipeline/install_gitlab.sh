#!/bin/bash
set -euo pipefail

IP=$(hostname -I | awk '{print $2}')
echo "START - install gitlab - $IP"

# ──────────────────────────────────────────────────────────────
# [1] Paquets de base + Locale (correction Debian 12 / Vagrant)
# ──────────────────────────────────────────────────────────────
echo "[1]: paquets de base"
apt-get update -qq >/dev/null
apt-get install -qq -y vim git wget curl ca-certificates tzdata locales >/dev/null

# Générer la locale AVANT toute installation
# Debian 12 sous Vagrant : /etc/locale.gen doit être modifié manuellement
sed -i 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen
dpkg-reconfigure --frontend=noninteractive locales
update-locale LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8

# Forcer dans l'environnement courant du script
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export LANGUAGE=en_US.UTF-8

# Vérification
locale
# ──────────────────────────────────────────────────────────────
# [2] GitLab CE
# CORRECTION : l'ancien script packages.gitlab.com/install/repositories
#              pointait vers une URL dépréciée. Le canal officiel est
#              packages.gitlab.com mais le script d'install a changé.
#              On utilise maintenant le script officiel packages.gitlab.com.
# ──────────────────────────────────────────────────────────────
echo "[2]: ajout dépôt GitLab CE"
curl -sS "https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh" \
  | bash

echo "[3]: installation GitLab CE"
# GITLAB_ROOT_PASSWORD permet de fixer le mot de passe root dès l'install
# EXTERNAL_URL obligatoire depuis GitLab 15+
GITLAB_ROOT_PASSWORD="ChangeMe123!" \
EXTERNAL_URL="http://192.168.10.10" \
  apt-get install -qq -y gitlab-ce >/dev/null

echo "[4]: reconfigure GitLab"
gitlab-ctl reconfigure

echo "END - install gitlab"
echo ">> GitLab accessible sur http://192.168.10.10 (root / ChangeMe123!)"
