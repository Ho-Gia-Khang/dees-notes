# start runnung ufw
sudo ufw enable
sudo ufw status verbose

# start running suricata
which suricata
suricata --build-info
sudo systemctl start suricata
sudo systemctl status suricata