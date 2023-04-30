#!/usr/bin/env bash
readonly STACK_NAME="DL-notes-Stack"
echo "Destroying stack - this may take a few minutes."
aws cloudformation delete-stack --stack-name "${STACK_NAME}"
aws cloudformation wait stack-delete-complete --stack-name "${STACK_NAME}"
echo "Stack deletion finished."

