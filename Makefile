.PHONY: test
deps:
	npm i
	cp .env.tpl .env
lint:
	/node_modules/.bin/eslint .
run:
	node server.js
