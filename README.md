## JSON-Serve

Lightweight, simple yet fast and useful tool that help you create a fake rest-api for your frontend by serving a json file.

## Installation

```shell
yarn add @ctuanle/json-serve --dev
or
npm install @ctuanle/json-serve --save-dev
```

## Usage

```shell
yarn jss [json-path] [port] [other-options]
```

| Options     | Required |  Default  | Description                 |
| :---------- | :------: | :-------: | :-------------------------- |
| json-path   |    no    | data.json | Path to your json file      |
| port        |    no    |   3000    | Port on which server run    |
| --no-strict |    no    |   false   | Turn on node-strict mode    |
| --readonly  |    no    |   false   | Turn on readonly mode       |
| --persist   |    no    |   false   | Turn on save-change-to-disk |

### Available methods

- GET
- POST
- PUT
- DELETE
- OPTIONS

### No-strict mode

By default, you can only post/put/delete to array data. But in no-strict mode, these action are allowed with object type.

### Read-only mode

In this mode, only GET requests are allowed. Default is false.

### Persist

Save changes created by POST/PUT/DELETE to your json file. Default is false, so changes are keep only on memory and will be deleted when you turn server off.

### Example

You've create a data.json file:

```shell
yarn jss data.json 3000
```

Or if you don't specify a path, a promt will appear and ask you if you want to create one:

```shell
yarn jss
```

You want to serve your json file and persist change:

```shell
yarn jss data.json 3000 --persist
```

## Details

If your json file contains this content:

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
    "2": "UDP"
  }
}
```

All available routes are:

```ts
/method
/method/[index]
/protocol
/protocol/[index]
```

### GET

To get "protocol", you can go with `GET /protocol`.

Or to get all methods, go with `GET /method`.

Plus, with array data, you can filter it with query, for example, to get all method that name is "GET", `GET /method?name=GET`

### POST

With post request, you can update your json file and persist it.

If the target resources is an array, received data will be pushed into the array.

Ex: `POST /method` with body `{"name": "PUT"}` will turn above data into

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
    "2": "UDP"
  }
}
```

Please note that if you edit json file manually while the server is running, edited data won't be seen by the server. In that case, restart the server.

### PUT

`PUT /protocol/0` with body `{"name": "PATCH"}` and `PUT /protocol/2` with body `"TCP"` will turn above data into:

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
    "2": "TCP"
  }
}
```

#### DELETE

With DELETE requests, you can delete a specific data.

`DELETE /method/2` and `DELETE /protocol/2` will turn above data into:

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
    "2": null
  }
}
```

## Screenshots

Colorful console logging:

![Logging Console](./public/console.png 'Logging console')

Sample response:

![Server response](./public/sample.png 'Sample response')
