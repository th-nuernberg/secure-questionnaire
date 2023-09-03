# Secure Questionaire

For self deployment 

To create self signed certificates using openssl, run
```openssl req  -nodes -new -x509  -keyout self-signed.key -out self-signed.cert```
in ./flaskapp/nginx/certs.
Or place pair created by CA into the directory to make the connection trusted.

To create login credentials for basic auth, run
```docker run --rm --entrypoint htpasswd httpd:2 -Bbn testuser testpassword > ./nginx.htpasswd```
in ./flaskapp/nginx/.
