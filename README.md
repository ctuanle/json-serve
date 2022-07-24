## JSON-Serve

By serving a json file as a rest api server, you can create a testing api within a minute with JSON-Serve.

### Note

Inspired by this awesome package [typicode/json-server](https://github.com/typicode/json-server), I would like to create one by myself, with no dependency.

### Usage

Install locally and use it to server a json file on a specific port

```shell
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

If the target resources is an normal object, string, number, ... it will be replaced by received data.

If the target resources does not exist, it will be created if it ancestors already exist. For example:

```json
{
  "C": {
    "code": {
      "projects": []
    }
  }
}
```

with above data, `POST /C/code/repos` or `POST /C/rom`, etc will be created. However, `POST C/exe/vscode` or `POST C/exo/vscode`, will return a `400 Bad request` response.

Updated/Created data will be persisted into the json file and can be accessed using GET requests.

Please note that if you edit json file manually while the server is running, edited data won't be seen by the server. In that case, restart the server.

#### DELETE

With DELETE requests, you can delete a specific data on your json file and persist it. With array data, query will help you filtering it.
