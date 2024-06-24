provider "aws" {
  profile = "vianaz"

  region  = var.region

  alias = "region"

  default_tags {
    tags = local.tags
  }
}
