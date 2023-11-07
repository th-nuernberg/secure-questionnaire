# Secure Questionaire

For self deployment please do the following 

- Create self signed certificates using openssl: <br> run
```openssl req  -nodes -new -x509  -keyout self-signed.key -out self-signed.cert``` <br>
in ./flaskapp/nginx/auth. <br>
Or place pair created by CA into the directory to make the connection trusted.

- Set JWT secret in ./flaskapp/backend/config.json

- Set admin password in ./flaskapp/backend/config.json
    - username: admin
    - name: admin
