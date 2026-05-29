# Telecharge l'image Docker nginx
resource "docker_image" "nginx" {
  # Nom complet de l'image avec tag
  name		= "nginx:${var.nginx_image_tag}"
  # Garder l'image meme si le conteneur est detruit
  keep_locally = true
}

# Cree le conteneur nginx
resource "docker_container" "nginx" {
  # Nom du conteneur (visible dans docker ps)
  name  = var.container_name
  # Reference l'image telechargee ci-dessus
  image = docker_image.nginx.image_id
  # Mapping de ports : expose le service
  ports {
    internal = var.internal_port   # Port dans le conteneur
    external = var.external_port   # Port sur l'hote
  }

  # Le conteneur redemarrera automatiquement
  restart = "unless-stopped"
}
