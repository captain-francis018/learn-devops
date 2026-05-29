# Affiche l'ID du conteneur cree
output "container_id" {
  description = "ID du conteneur nginx"
  value       = docker_container.nginx.id
}

# Affiche le nom du conteneur
output "container_name" {
  description = "Nom du conteneur"
  value       = docker_container.nginx.name
}

# URL d'acces au service
output "access_url" {
  description = "URL pour acceder a nginx"
  value       = "http://localhost:${var.external_port}"
}
