.PHONY: test
deps:
	npm i
	cp .env.tpl .env
lint:
	./node_modules/.bin/eslint .
test:
	make lint
	make cover
cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha -- test --recursive --timeout=3000 --exit
run:
	node server.js
