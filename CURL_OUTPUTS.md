# Verified cURL examples

Captured against the completed service on an isolated local database. IDs are assigned by the database.

## Create — 201

```sh
curl --silent --show-error --include -X POST http://localhost:18080/api/products -H 'Content-Type: application/json' --data '{"name": "Submission demo", "description": "cURL verification product", "price": 29.95, "available": true, "category": "TOOLS"}'
```

```text
HTTP/1.1 201 Created
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Location: /api/products/38
Content-Type: application/json; charset=utf-8
Content-Length: 126
ETag: W/"7e-VJzUWF5NM5s8ntRO5gRLrRwSmdI"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":38,"name":"Submission demo","description":"cURL verification product","price":29.95,"available":true,"category":"TOOLS"}
```

## Read — 200

```sh
curl --silent --show-error --include http://localhost:18080/api/products/38
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 126
ETag: W/"7e-VJzUWF5NM5s8ntRO5gRLrRwSmdI"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":38,"name":"Submission demo","description":"cURL verification product","price":29.95,"available":true,"category":"TOOLS"}
```

## Update — 200

```sh
curl --silent --show-error --include -X PUT http://localhost:18080/api/products/38 -H 'Content-Type: application/json' --data '{"name": "Submission demo", "description": "cURL verification product", "price": 39.95, "available": false, "category": "TOOLS"}'
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 127
ETag: W/"7f-qOcPCFT4dnjlnjk1L55XMros44Y"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":38,"name":"Submission demo","description":"cURL verification product","price":39.95,"available":false,"category":"TOOLS"}
```

## List all — 200

```sh
curl --silent --show-error --include http://localhost:18080/api/products
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 551
ETag: W/"227-Cp1MQzHioV4Oukvtjn34AXa3k7E"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":34,"name":"Hat","description":"A red fedora","price":59.95,"available":true,"category":"CLOTHS"},{"id":35,"name":"Shoes","description":"Blue shoes","price":120.5,"available":false,"category":"CLOTHS"},{"id":36,"name":"Big Mac","description":"1/4 lb burger","price":5.99,"available":true,"category":"FOOD"},{"id":37,"name":"Sheets","description":"Full bed sheets","price":87,"available":true,"category":"HOUSEWARES"},{"id":38,"name":"Submission demo","description":"cURL verification product","price":39.95,"available":false,"category":"TOOLS"}]
```

## List by name — 200

```sh
curl --silent --show-error --include --get http://localhost:18080/api/products --data-urlencode 'name=Submission demo'
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 129
ETag: W/"81-WDiOedXmyCXmjW37lDrEW6FJrz0"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":38,"name":"Submission demo","description":"cURL verification product","price":39.95,"available":false,"category":"TOOLS"}]
```

## List by category — 200

```sh
curl --silent --show-error --include 'http://localhost:18080/api/products?category=TOOLS'
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 129
ETag: W/"81-WDiOedXmyCXmjW37lDrEW6FJrz0"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":38,"name":"Submission demo","description":"cURL verification product","price":39.95,"available":false,"category":"TOOLS"}]
```

## List by availability — 200

```sh
curl --silent --show-error --include 'http://localhost:18080/api/products?availability=false'
```

```text
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 233
ETag: W/"e9-i2w4FZRWA5cFSyphtaR8nLYGxQc"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":35,"name":"Shoes","description":"Blue shoes","price":120.5,"available":false,"category":"CLOTHS"},{"id":38,"name":"Submission demo","description":"cURL verification product","price":39.95,"available":false,"category":"TOOLS"}]
```

## Delete — 204

```sh
curl --silent --show-error --include -X DELETE http://localhost:18080/api/products/38
```

```text
HTTP/1.1 204 No Content
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

## Read after deletion — 404

```sh
curl --silent --show-error --include http://localhost:18080/api/products/38
```

```text
HTTP/1.1 404 Not Found
Content-Security-Policy: default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 58
ETag: W/"3a-IenOL4h/fP1pSRLgh/wsBkIm5RI"
Date: Fri, 30 Oct 2026 04:28:29 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not Found","message":"Product 38 was not found"}
```
