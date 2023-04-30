#!/bin/bash

echo "Installing dependencies..."

sudo apt update
sudo apt -y install -y gcc-c++ make
sudo apt -y install screen
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs 
sudo apt install -y docker

#obtain ssh key for git access
echo "Setting up ssh access keys"
curl -s https://github.com/DL124.keys | tee -a /home/ec2-user/.ssh/authorized_keys

#run docker as a git vector
echo "Installing application..."
chkconfig docker on
service docker start

# add ec2 user to the docker group which allows docket to run without being a super-user
usermod -aG docker ec2-user
docker pull 
docker run -d -p 80:80 DL124/aaf-internal-notes-system:latest

echo "installing deps and starting application..."
(cd /home/aaf-internal-notes-system/01-notebook && npm install && DEBUG=* PORT=80 npm run start)
echo "Application is now running on localhost."

