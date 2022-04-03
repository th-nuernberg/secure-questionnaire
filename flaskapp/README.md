
# Endpoints

### POST

```console
POST http://localhost/POST/<id>
```
Takes JSON and posts it in database. Example request:

```console
curl --request POST \
  --url http://localhost/POST/16 \
  --header 'Content-Type: application/json' \
  --data '{"henlio":123, "text":"hihiho"}'
```
