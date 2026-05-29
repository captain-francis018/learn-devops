#Nom du conteneur  nginx
variable "container_name" {
  description = "Nom du conteneur nginx"
  type	      = string
  default     = "nginx-dev"
}

# Port externe expose sur l'hote
variable "external_port" {
  description = "Port externe pour acceder a nginx"
  type        = number
  default     = 80
}

# Port interne du conteneur
variable "internal_port" {
  description = "Port interne nginx"
  type        = number
  default     = 80
}



# Tag de l'image Docker
variable "nginx_image_tag" {
  description = "Tag de l'image nginx"
  type        = string
  default     = "latest"
}
