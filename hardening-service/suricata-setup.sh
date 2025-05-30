# install suricata via ppa repository
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:oisf/suricata-stable
sudo apt update 
sudo apt-get install suricata

# check the installed suricata version
which suricata
suricata --build-info

# run suricata
sudo systemctl enable suricata

# open suricata configure file
sudo nano /etc/suricata/suricata.yaml

# download suricata rule sets
sudo suricata-update

# run suricata
sudo systemctl start suricata
sudo systemctl status suricata