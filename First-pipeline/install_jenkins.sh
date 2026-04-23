#!/bin/bash

## install master consul

IP=$(hostname -I | awk '{print $2}')

echo "START - install jenkins - "$IP

echo "[1]: Install utils et Ansible"
apt-get update -qq >/dev/null
apt-get install -qq -y git sshpass wget ansible gnupg2 curl  >/dev/null

echo "[2]: install java & jenkins"
# Installation de Java
apt-get install -qq -y default-jre >/dev/null

# Nouvelle méthode pour la clé Jenkins (plus sécurisée)
curl -fsSL https://jenkins.io | sudo tee \
  /usr/share/keyrings/jenkins-keyring.asc > /dev/null

# Ajout du dépôt avec la nouvelle clé
echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/" | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null

apt-get update -qq >/dev/null
apt-get install -qq -y jenkins >/dev/null
systemctl enable jenkins
systemctl start jenkins

echo "[3]:Ansible custum"
sed -i 's/.*pipelining.*/pipelining = True/' /etc/ansible/ansible.cfg
sed -i 's/.*allow_world_readable_tmpfiles.*/allow_world_readable_tmpfiles = True/' /etc/ansible/ansible.cfg

echo "[4]START - install docker - "$IP
curl -fsSL https://get.docker.com | sh; >/dev/null
usermod -aG docker jenkins
curl -sL "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
echo "[5]: use registry without ssl"
echo "
{
  "insecure-registries" : ["192.168.10.5:5000"]
}
" >/etc/docker/daemon.json
systemctl daemon-reload
systemctl restart docker

echo "END - install jenkins"


