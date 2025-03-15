# Prerequisites

## 1. Have a domain name :))

## 2. Have a Cloudflare account with a DNS record registered with the domain name you own

## 3. Configure the domain name to match the requirements from Cloudflare to avoid suspension after 15 days by Cloudflare (The instruction is based on your DNS provider, please follow the instruction from Cloudflare)

# Basic setup

## 1. Create a file name 'cloudflare-ddns.sh' from the template provided in 'Cloudflare-ddns_example.sh' file in the same directory with this file. Filled the information required for Cloudflare

## 2. Build a docker container

```
docker compose up --build -d
```

## 3. Setup local firewall

### Copy the script in 'hardening-service' to a .sh file in another trustable folder

### Grand execute permission to it

```
chmod +x /trustable-path/[filename].sh
```

```
./trustable-path/[filename].sh
```

## 4. For the next time visit, just run the docker container in your docker manager app or

```
docker compose up
```
