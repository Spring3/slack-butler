.PHONY: test
deps:
	npm i
	cp .env.tpl .env
lint:
	./node_modules/.bin/eslint .
test:
	NODE_ENV=test make cover
cover:
	make lint
	./node_modules/.bin/nyc cover --timeout=3000
run:
	npm start
