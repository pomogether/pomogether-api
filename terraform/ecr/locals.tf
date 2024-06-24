locals {
  # Project informations
  project = "foundation"
  bu      = "pomogether"

  tags = {
    project     = local.project
    bu          = local.bu
    OU          = "infrastructure"
    owner       = "infrastructure"
    managed-by  = "terraform"
  }
}