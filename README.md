# Prerequisites

1. Have a domain name :))

2. Have a Cloudflare account with a DNS record registered with the domain name you own.

3. Configure the DNS record to match the requirements from Cloudflare to avoid suspension after 15 days by Cloudflare (The instruction is based on your DNS provider, please follow the instruction from Cloudflare).

# Basic setup

## 1. DDNS setup

1. Generate a Cloudflare API token:

   1.1. Go to your DNS record and find 'API Token' section.

   1.2. Create a token using 'Edit DNS' template (not the public API Ken. Also, existing tokens cannot be used, it must be a new token)

   1.3. Grand the edit permission to that token if you use other templates. Include all DNS zones as well.

   1.4. Hit create token, copy the API Key and store it securely since it will not appear again.

2. Create a file name `cloudflare-ddns.sh` from the template provided in `Cloudflare-ddns_example.sh` file in the same directory.

3. Filled the information required for Cloudflare - the email and API Key (the one you got from creating a new API Token, not the public key).

4. Ensure to not public that file by ignoring it in `.gitignore` and any other publishing way

## 2. Deploy services locally

1. Install Docker and optionally a docker containers manager app (Docker desktop or Portainer is recommended)

2. Build the containers:

```
docker compose up --build -d
```

## 3. Configure Reverse Proxy

1. Access the admin web of the `app` container (by default it is accessible via port 81)

2. Login to NGINX. The default account is

```
admin@example.com

changeme
```

3. Register a SSL Certificate:

   3.1. Go to 'SSL certificate' tab and hit add a certificate.

   3.2. Enter the domain name of yours, and turn on DNS challenge, choose Cloudflare as the DNS provider, and provide the Cloudflare API key (the same as the one in cloudflare-ddns.sh file).

   3.3. That's all the necessary info, hit create.

4. Create a proxy host

   4.1. Find the local IP address of your device.

   4.2. Go to 'Proxy Host' section and add a proxy host.

   4.3. Forward the request to the port of `public-gateway` service (the default port is 4300) by filling the local ip address of your device `http://your.local.ip.address` and the port number. Use HTTP protocol.

   4.4. Turn on Block common exploit. Navigate to 'SSL' tab, select the SSL certificate your have created earlier (it has the name of your domain name) and turn on 'force SSL'.

   4.5. Go back to your DNS record in Cloudflare, find the SSL/TLS section, configure SSL/TLS Certificate to be full or full-strict (either of them should work), and turn on 'Always use HTTPS'

## 4. Setup local firewall

1. Copy the script from the file `ufw-setup.sh` in `hardening-service` directory to a .sh file in another trustable folder

2. Grand execute permission to it

```
chmod +x /trustable-path/[filename].sh
```

3. Execute the script (only once)

```
./trustable-path/[filename].sh
```

## 5. For the next time visit

Run all the docker containers in your docker manager app or

```
docker compose up
```

To turn it of, stop all the containers or

```
docker compose down
```

# Configuration
