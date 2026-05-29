# Configuration Terraform : version minimale et providers requis
terraform {
  # Version minimale de Terraform requise
  required_version = ">= 1.7.0"
  
  # Declaration des providers necessaires
  required_providers {
    docker = {
      # Source officielle sur le Terraform Registry
      source = "kreuzwerker/docker"
      # Contrainte de version (compatible 3.x)
      version = "~> 3.0"
    
  }
 } 
}

# Configuration du provider Docker
# Se connecte au daemon Docker local via le socket Unix
provider "docker" {
  host = "unix:///var/run/docker.sock"
}
