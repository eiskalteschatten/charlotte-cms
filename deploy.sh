#!/bin/bash

cd /var/www/tf-labs

echo "Pulling latest code from GitHub..."
sudo -u www-data git pull
wait

echo "Installing dependencies..."
sudo -u www-data npm i
wait

echo "Building the project..."
sudo -u www-data npm run build
wait

echo "Update file permissions..."
cd /var/www
sudo chown -R www-data:www-data tf-labs

echo "Restarting the service..."
cd /var/www/tf-labs
sudo systemctl restart tflabs
wait

echo "Deployment complete!"
