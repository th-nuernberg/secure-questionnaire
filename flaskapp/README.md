
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
	"_id": "SomeIDs"
}
```
