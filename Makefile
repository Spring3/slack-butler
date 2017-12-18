.PHONY: test
deps:
	npm i
	cp .env.tpl .env
lint:
	./node_modules/.bin/eslint .
test:
	make lint
run:
	node server.js
