
# Endpoints

### POST

```console
POST http://localhost/POST/<id>
```
Takes JSON and posts it in database. 

Sample request:

```console
curl --request POST \
  --url http://localhost/POST/SomeID \
  --header 'Content-Type: application/json' \
  --data '{"Some_JSON":{"SomeKey":"SomeValue"}}'
```

Sample response:

```console
{
	"Some_JSON": {
		"SomeKey": "SomeValue"
	},
	"_id": "SomeID"
}
```


### GET

```console
GET http://localhost/GET/<id>
```
Get JSON from database by id.

Sample request:

```console
curl --request GET \
  --url http://localhost/GET/SomeID
```

Sample response:

```console
{
	"Some_JSON": {
		"SomeKey": "SomeValue"
	},
	"_id": "SomeID"
}
```

### PUT

```console
PUT http://localhost/PUT/<id>
```
Put JSON in database. Updates if id in database posts else.

Sample request:

```console
curl --request PUT \
  --url http://localhost/PUT/SomeID \
  --header 'Content-Type: application/json' \
  --data '{"Some_JSON":{"SomeKey":"SomeValue"}}'
```

Sample response:

```console
{
	"Some_JSON": {
		"SomeKey": "SomeValue"
	},
	"_id": "SomeID"
}
```
