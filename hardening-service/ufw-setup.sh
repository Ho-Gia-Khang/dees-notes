# install ufw if it is not (by default it is installed in Ubuntu)
sudo apt update
sudo apt install ufw

# default all incoming requests and still maintain outgoing requests by default
sudo ufw default deny incoming
sudo ufw default allow outgoing

# allow specific service to run
sudo ufw allow HTTP
sudo ufw allow HTTPS
sudo uwf allow 22 
sudo ufw allow 'NGINX Full'

sudo ufw enable

sudo ufw status verbose

echo "UFW setup completed!"