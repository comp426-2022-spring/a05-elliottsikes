# Coinserver

A NodeJS/Express REST API that serves up coin flips

This was developed from in-class demos for UNC COMP 426 Spring 2022.

# Coinserver API Documentation

## Endpoints

### /app/

Responds "200 OK"

#### Response body

```
curl http://localhost:5000/app/
```
```json
{"message":"Your API works! (200)"}
```

#### Headers

```
curl -I http://localhost:5000/app/
```
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 35
ETag: W/"23-KNmhzXgQhtEE5ovS3fuLixylNK0"
Date: Thu, 28 Apr 2022 23:57:37 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
### /app/flip/

#### Response body

```
curl http://localhost:5000/app/flip/
```
```json
{"flip":"tails"}
```
### /app/flips/:number/

#### Response body

```
curl http://localhost:5000/app/flips/4
```
```
{"raw":["tails","heads","heads","heads"],"summary":{"tails":1,"heads":3}}
```
### /app/flip/call/

#### Request body

```json
{"call":"(heads|tails)"}
```

#### Response body

```
curl -X POST -d '{"guess":"tails"}' -H 'Content-Type: application/json' http://localhost:5000/app/flip/call/
```

```json
{"call":"tails","flip":"tails","result":"win"}
```
### /app/flip/call/:guess(heads|tails)/

#### Response body

```
curl http://localhost:5000/app/flip/call/heads
```
```json
{"call":"tails","flip":"tails","result":"win"}
```
### /app/flip/coins/

#### Request body

```json
{"number":"\d"}
```
#### Response body

```
curl -X POST -d '{"number":"5"}' -H 'Content-Type: application/json' http://localhost:5000/app/flip/coins/
```

```json
{"raw":["heads","heads","heads","tails","tails"],"summary":{"heads":3,"tails":2}}
```
### /app/log/access/

#### Response body

```
curl http://localhost:5000/app/log/access
```

```json
[{"id":1,"remoteaddr":"::1","remoteuser":null,"time":"1651190213738.0","method":"GET","url":"/","protocol":"http","httpversion":"1.1","status":"200.0","referrer":null,"useragent":"curl/7.74.0"},{"id":2,"remoteaddr":"::1","remoteuser":null,"time":"1651190219236.0","method":"GET","url":"/app/","protocol":"http","httpversion":"1.1","status":"200.0","referrer":null,"useragent":"curl/7.74.0"}]
```

### /app/log/error/

_Not yet implemented_

#### Response body

```json

```
### /app/login/

_Not yet implemented_

#### Request body

```json

```
#### Response body

```json

```
#### Headers

```

```
### /app/user/login/

_Not yet implemented_

#### Request body

```json

```
#### Response body

```json

```
#### Headers

```

```
### /app/user/new/

_Not yet implemented_

#### Request body

```json

```
#### Response body

```json

```
#### Headers

```

```
### /app/user/update/

_Not yet implemented_

#### Request body

```json

```
#### Response body

```json

```
#### Headers

```

```
### /app/user/delete/

_Not yet implemented_

#### Request body

```json

```
#### Response body

```json

```
#### Headers

```

```
