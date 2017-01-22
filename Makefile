.PHONY: test
init:
	cp .env.tpl .env
deps:
	npm i
run:
	make init
	node server.js