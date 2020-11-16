# Test Interview Delivery Much

## Tecnologies
 - Nodejs
 - Express
 - Chai
 - Mocha
 - Sinon
 - Docker
 - Joi
 - Celebrate
 - Redis

## Setup
Must be installed docker and docker-compose

  - On Windows
> https://docs.docker.com/docker-for-windows/install/
  - On Ubuntu
> https://docs.docker.com/engine/install/ubuntu/
  - On Macosx
> https://docs.docker.com/docker-for-mac/install/

 **If you use windows maybe you must to install _Make_**
> http://gnuwin32.sourceforge.net/packages/make.htm


## First Steps

### Create a env file as a _.env.sample_ and add a GIPHY_KEY
> GIPHY_KEY=<YOUR_KEY>

### Run to build a container (<span style="color:red"> it may take a while to install if you don't have the image built </span>)
```bash
make build
```
- make build it's command to run a docker-compose.yml and it makes a images build all images

### Start the system
```bash
make start
```
### Enter container 
```bash
make run
```
### Stop system
```bash
make stop
```
### Remove the system
```bash
make remove
```

## See application logs

#### All logs
```bash
make logs
```

#### Last 100 line (HEAD)
```bash
make logs-tail
```

## Test

### To run lint + unit tests
```bash
make test
```

### lint
```bash
make lint
```

### Unit tests
```bash
make mocha
```
## Release

### Release
```bash
make release
```
## Pre-release
```bash
make prerelease

```

## Cache

### Run redis cli
```bash
make redis-cli
```
## Clear all keys on cache
```bash
make clear-redis

```


## Deploy
To deploy the application you can run a Docker inside folder
**docker/deploy** and call a command to start
Example:
 Steps:
  - Clone the application
  - run docker build
```bash
docker build [OPTIONS] PATH | URL | -
```
 - And run the command inside container to run a application
```
npm run start
```

## Routes
 - version
> http://localhost:4002/version
 - health
> http://localhost:4002/health
 - Get recipe using a dish, ex:
> http://localhost:4002/recipes/?i=onions&q=omelet
- Get recipe using without dish, ex:
> http://localhost:4002/recipes/?i=onions,potato

|property|type|value|description|
|:--------:|:----:|:-----:|-----------:|
| i | array| array of string | the value must be set equals to ex: i=onions,beans, potato|
| q | string| string | ex: omelet|
| page | number | integer | must to pass if want to pass to next page of results|
