#!/bin/bash
set -euo pipefail

IP=$(hostname -I | awk '{print $2}')
echo "START - install jenkins - $IP"

# ──────────────────────────────────────────────────────────────
# [1] Paquets de base
# ──────────────────────────────────────────────────────────────
echo "[1]: paquets de base"
apt-get update -qq >/dev/null
apt-get install -qq -y git sshpass wget ansible gnupg2 curl ca-certificates fontconfig fonts-dejavu-core >/dev/null
# ──────────────────────────────────────────────────────────────
# [2] Java 21 (Oracle JDK — requis par Jenkins LTS 2025+)
# CORRECTION : openjdk-17 et openjdk-21 des dépôts Debian
#              ne sont pas reconnus par Jenkins 2.543+
#              Solution : Oracle JDK 21 officiel
# ──────────────────────────────────────────────────────────────

echo "[2]: install Java 21 (Oracle JDK)"

cd /tmp
wget -q https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.deb
dpkg -i jdk-21_linux-x64_bin.deb
rm -f jdk-21_linux-x64_bin.deb
cd -

# Vérification
java -version

# ──────────────────────────────────────────────────────────────
# [3] Jenkins
# CORRECTION : jenkins.io-2023.key expirée depuis décembre 2025
#              Nouvelle clé : jenkins.io-2026.key
# ──────────────────────────────────────────────────────────────
echo "[3]: install Jenkins"

apt-get install -qq -y gnupg2 ca-certificates wget >/dev/null

# Nouvelle clé GPG Jenkins 2026
wget -q -O /etc/apt/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] \
https://pkg.jenkins.io/debian-stable binary/" \
  | tee /etc/apt/sources.list.d/jenkins.list > /dev/null

apt-get update -qq >/dev/null
apt-get install -qq -y jenkins >/dev/null
systemctl enable jenkins
systemctl start jenkins

echo "[4]: config Ansible"

mkdir -p /etc/ansible

if [ ! -f /etc/ansible/ansible.cfg ]; then
  cat <<EOF > /etc/ansible/ansible.cfg
[defaults]
pipelining = True
allow_world_readable_tmpfiles = True
EOF
else
  sed -i 's/.*pipelining.*/pipelining = True/' /etc/ansible/ansible.cfg
  sed -i 's/.*allow_world_readable_tmpfiles.*/allow_world_readable_tmpfiles = True/' /etc/ansible/ansible.cfg
fi
# ──────────────────────────────────────────────────────────────
# [5] Docker
# ──────────────────────────────────────────────────────────────
echo "[5]: install Docker"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg \
  | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list

apt-get update -qq >/dev/null
apt-get install -qq -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin >/dev/null

usermod -aG docker jenkins

# ──────────────────────────────────────────────────────────────
# [6] Docker Compose
# CORRECTION : le binaire standalone 1.25.0 est obsolète (v1, Python).
#              Docker Compose V2 est maintenant un plugin intégré.
#              On crée un alias /usr/local/bin/docker-compose → V2.
# ──────────────────────────────────────────────────────────────
echo "[6]: docker-compose shim (V2)"
ln -sf /usr/libexec/docker/cli-plugins/docker-compose /usr/local/bin/docker-compose

# ──────────────────────────────────────────────────────────────
# [7] Registry insecure (inchangé, adresse locale)
# ──────────────────────────────────────────────────────────────
echo "[7]: config daemon Docker"
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<'EOF'
{
  "insecure-registries": ["192.168.10.5:5000"]
}
EOF

systemctl daemon-reload
systemctl restart docker

echo "END - install jenkins"
