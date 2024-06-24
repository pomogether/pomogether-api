resource "aws_ecrpublic_repository" "repository" {
  provider = aws.region

  repository_name = "pomogether_api"

  catalog_data {
    about_text        = "Pomogether API Docker images"
    architectures     = ["x86", "ARM 64"]
    description       = "Repository for Pomogether API Docker images"
    operating_systems = ["Linux"]
  }
}
