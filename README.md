## JSON-Serve

By serving a json file as a rest api server, you can create a testing rest-api within less than a minute with JSON-Serve.

### Note

Inspired by this awesome package [typicode/json-server](https://github.com/typicode/json-server), I would like to create one by myself, with no dependency.

### Usage

Install locally (i will publish this package on npm in the future) and use it to server a json file on a specific port.

First, clone this repo and run these commands:

```shell
yarn
yarn install:local
yarn json-serve [json-file] [port]
```

#### GET

You can get any resources that exists in your json file by given it's path. For example:

```json
{
  "method": [
    {
      "name": "GET"
    },
    {
      "name": "POST"
    }
  ],
  "protocol": "HTTP"
}
```

To get "protocol", you can go with `GET /protocol`.

Or to get all methods, go with `GET /method`.

Plus, with array data, you can filter it with query, for example, to get all method that name is "GET", `GET /method?name=GET`

#### POST

With post request, you can update your json file and persist it.

If the target resources is an array, received data will be pushed into the array.

If the target resources is an normal object, new key will be created (for now, it is a number that is calculated by add 1 to max value key) and attach to request body.

<!-- If the target resources does not exist, it will be created if it ancestors already exist. For example: -->

```json
{
  "method": [
    {
      "name": "GET"
    },
    {
      "name": "POST"
    }
  ],
  "protocol": {
    "1": "HTTP",
    "2": "HTTPS"
  }
}
```

<!-- with above data, `POST /C/code/repos` or `POST /C/rom`, etc will be created. However, `POST C/exe/vscode` or `POST C/exo/vscode`, will return a `400 Bad request` response. -->

Ex: `POST /method` with body `{"name": "PUT"}` and `POST /protocol` with body `"TCP"` will turn above data into

```json
{
  "method": [
    {
      "name": "GET"
    },
    {
      "name": "POST"
    },
    {
      "name": "PUT"
    }
  ],
  "protocol": {
    "1": "HTTP",
    "2": "HTTPS",
    "3": "TCP"
  }
}
```

Updated/Created data will be persisted into the json file and can be accessed using GET requests.

Please note that if you edit json file manually while the server is running, edited data won't be seen by the server. In that case, restart the server.

#### PUT

`POST /protocol/0` with body `{"name": "PATCH"}` and `POST /protocol/3` with body `"UDP"` will turn above data into:

```json
{
  "method": [
    {
      "name": "PATCH"
    },
    {
      "name": "POST"
    },
    {
      "name": "PUT"
    }
  ],
  "protocol": {
    "1": "HTTP",
    "2": "HTTPS",
    "3": "UDP"
  }
}
```

#### DELETE

With DELETE requests, you can delete a specific data on your json file and persist it.

<!-- With array data, query will help you filtering it. -->

`DELETE /method/2` and `DELETE /protocol/3` will turn above data into:

```json
{
  "method": [
    {
      "name": "PATCH"
    },
    {
      "name": "POST"
    },
    null
  ],
  "protocol": {
    "1": "HTTP",
    "2": "HTTPS",
    "3": null
  }
}
```
