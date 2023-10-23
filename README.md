# Secure Questionaire

For self deployment please do the following 

- Create self signed certificates using openssl: <br> run
```openssl req  -nodes -new -x509  -keyout self-signed.key -out self-signed.cert``` <br>
in ./flaskapp/nginx/auth. <br>
Or place pair created by CA into the directory to make the connection trusted.

- Create login credentials for basic auth: <br>
 run ```docker run --rm --entrypoint htpasswd httpd:2 -Bbn testuser testpassword > ./nginx.htpasswd``` <br> in ./flaskapp/nginx/auth.

- Set JWT secret for signing in ./flaskapp/backend/config.json
