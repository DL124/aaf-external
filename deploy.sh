#!/usr/bin/env bash
# spins up vpc and then ec2 instance using cloudformation
# ensure AWS_PROFILE/SECRET_ACCESS are set before

readonly stack_name = "DL-notes-Stack"
readonly tags = ("ApplicationName=cs-server" "Owner=u2233909@live.warwick.ac.uk")
readonly region = "eu-west-2"

echo "Deploying infrastructure (this may take a few minutes)"
# deploy network
aws cloudformation deploy \
  --template-file "infra/setup.yaml" \
  --stack-name "${stack_name}" \
  --capabilities CAPABILITY_IAM \
  --tags "${tags[@]}" \
  --no-fail-on-empty-changeset \
  --region "${region}" \
# have to wait for VPC  
aws cloudformation wait stack-create-complete --stack-name "${stack_name}"
echo "Finished."