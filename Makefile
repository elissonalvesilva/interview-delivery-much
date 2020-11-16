.PHONY: build start stop remove logs lint mocha test run release redis-cli clear-redis

SHELL := /bin/bash
branch := $(shell git branch | grep \* | cut -d ' ' -f2)
CONTAINER_NAME := delivery-api

build:
	docker-compose build
	docker-compose run --rm app npm install

start:
	docker-compose up -d

stop:
	docker-compose down

remove:
	docker-compose rm

logs:
	docker logs -f $(CONTAINER_NAME) | node_modules/.bin/pino-pretty

logs-tail:
	docker logs -f --tail 100 $(CONTAINER_NAME) | node_modules/.bin/pino-pretty

lint:
	docker-compose run --rm app npm run lint

mocha:
	docker-compose run --rm app npm run mocha

test: lint mocha

populate:
	node scripts/populate.js

run:
	docker-compose exec app sh

## Version management
release:
ifeq ($(branch),master)
	npm run release
	git push origin master
	git push --tags
else
	@echo "You need to be in branch master"
endif

## Prerelease
prerelease:
	npm run release -- --prerelease
	git push origin $(git symbolic-ref --short HEAD)
	git push --tags

# enter redis container
redis-cli:
	docker-compose exec redis redis-cli

# deletes all keys from redis
clear-redis:
	docker-compose exec redis redis-cli flushall
