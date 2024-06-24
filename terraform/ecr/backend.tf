terraform {
  backend "s3" {
    profile = "vianaz"

    bucket = "pomogether-tf-bucket"
    key    = "terraform-aws-ecr.tfstate"

    region  = "us-east-1"
    encrypt = true
  }
}
