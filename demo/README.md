# Json-serve Demo

Here is a simple demo serving data.json as a rest api server on read-only mode.

```shell
yarn global add @ctuanle/json-serve
```

```shell
jss data.json 3000 --readonly
```

Just that and I have an useful rest api here [jss-demo.fly.dev](https://jss-demo.fly.dev/) on [fly.io](https://fly.io/)

## Data sources

The data in the json file is not my own data but from [World Meters](https://www.worldometers.info/) on 24 October 2022.

## API

Base URL:

```shell
https://jss-demo.fly.dev/
```

Some routes:

```ts
GET /country
GET /country?[query]
GET /country/[id]
GET /country/[id]/[property]
GET /corona
GET /corona/by_country
GET /corona/by_country?[query]
GET /corona/by_country/[countryId]
GET /corona/by_country/[countryId]/[property]
GET /corona/total
GET /corona/total/world
GET /corona/total/euro
GET /corona/total/asia
GET /corona/total/north_ameria
GET /corona/total/south_america
GET /corona/total/africa
GET /corona/total/oceania
GET /sources
...
```
